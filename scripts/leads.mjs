// VG Контур — безопасные операции с локальным хранилищем заявок (NDJSON).
//
// Формат хранилища (источник истины — lib/leadStorage.ts):
//   - основная запись:  type = "lead" | "estimate"  (telegramDeliveryStatus: "pending")
//   - статус доставки:   type = "status" (связь по id) -> "sent" | "failed"
//
// Путь к файлу: LEADS_STORAGE_PATH, иначе fallback ./storage/leads.ndjson.
//
// Безопасность:
//   - скрипт НЕ читает .env-файлы (значения берутся только из реального окружения);
//   - НЕ печатает токены, chat_id, payload заявки;
//   - телефон и имя в summary/tail всегда маскируются;
//   - бэкапы/экспорты по умолчанию пишутся рядом с хранилищем (вне git).
//
// Использование:
//   node scripts/leads.mjs summary
//   node scripts/leads.mjs tail [N]                 (по умолчанию 10)
//   node scripts/leads.mjs backup
//   node scripts/leads.mjs export [--mask] [--out <path>]
//
// Через npm (аргументы после --):
//   npm run leads:summary
//   npm run leads:tail -- 20
//   npm run leads:backup
//   npm run leads:export -- --mask

import { readFile, writeFile, copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

function resolveStoragePath() {
  const fromEnv = process.env.LEADS_STORAGE_PATH?.trim();

  if (fromEnv) {
    return path.resolve(fromEnv);
  }

  return path.resolve(process.cwd(), "storage", "leads.ndjson");
}

// 2026-06-21_14-05-09 — без двоеточий, безопасно для имён файлов.
function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
}

async function readRecords(filePath) {
  let raw;

  try {
    raw = await readFile(filePath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { records: [], invalid: 0, missing: true };
    }
    throw error;
  }

  const records = [];
  let invalid = 0;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    try {
      records.push(JSON.parse(trimmed));
    } catch {
      // Битую строку пропускаем; содержимое наружу не печатаем.
      invalid += 1;
    }
  }

  return { records, invalid, missing: false };
}

// Сводим основные записи с их финальным статусом доставки (связь по id).
function reconcile(records) {
  const leads = new Map();
  const statuses = new Map();

  for (const rec of records) {
    if (!rec || typeof rec !== "object") {
      continue;
    }

    if (rec.type === "lead" || rec.type === "estimate") {
      leads.set(rec.id, rec);
    } else if (rec.type === "status" && rec.id) {
      statuses.set(rec.id, rec.telegramDeliveryStatus);
    }
  }

  const items = [];

  for (const [id, base] of leads) {
    const status = statuses.get(id) ?? base.telegramDeliveryStatus ?? "pending";
    items.push({ id, base, status });
  }

  items.sort((a, b) => String(a.base.createdAt).localeCompare(String(b.base.createdAt)));

  return items;
}

// Телефон: оставляем только последние 2 цифры.
function maskPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) {
    return "—";
  }

  if (digits.length <= 2) {
    return "*".repeat(digits.length);
  }

  return "*".repeat(digits.length - 2) + digits.slice(-2);
}

// Имя: первая буква + ***.
function maskName(value) {
  const name = String(value ?? "").trim();
  return name ? `${name.slice(0, 1)}***` : "—";
}

function pad(value, width) {
  const s = String(value ?? "");
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}

function workLabel(base) {
  return base.serviceType || base.workType || base.objectType || "—";
}

async function cmdSummary() {
  const filePath = resolveStoragePath();
  const { records, invalid, missing } = await readRecords(filePath);

  console.log(`Хранилище: ${filePath}`);

  if (missing) {
    console.log("Файл не найден — записей нет.");
    return;
  }

  const items = reconcile(records);
  const byType = { lead: 0, estimate: 0 };
  const byStatus = { pending: 0, sent: 0, failed: 0 };

  for (const item of items) {
    byType[item.base.type === "estimate" ? "estimate" : "lead"] += 1;
    if (item.status in byStatus) {
      byStatus[item.status] += 1;
    }
  }

  console.log("");
  console.log(`Всего строк (события):   ${records.length}`);
  console.log(`Уникальных заявок:       ${items.length}`);
  console.log(`  • заявки (lead):       ${byType.lead}`);
  console.log(`  • сметы (estimate):    ${byType.estimate}`);
  console.log("Доставка в Telegram:");
  console.log(`  • pending:             ${byStatus.pending}`);
  console.log(`  • sent:                ${byStatus.sent}`);
  console.log(`  • failed:              ${byStatus.failed}`);

  if (invalid > 0) {
    console.log(`Пропущено битых строк:   ${invalid}`);
  }
}

async function cmdTail(args) {
  const parsed = Number.parseInt(args[0], 10);
  const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;

  const filePath = resolveStoragePath();
  const { records, invalid, missing } = await readRecords(filePath);

  console.log(`Хранилище: ${filePath}`);

  if (missing) {
    console.log("Файл не найден — записей нет.");
    return;
  }

  const items = reconcile(records).slice(-limit);

  if (items.length === 0) {
    console.log("Заявок нет.");
    return;
  }

  console.log(`Последние ${items.length} (имя и телефон маскированы):`);
  console.log("");

  for (const { base, status } of items) {
    const kind = base.type === "estimate" ? "смета " : "заявка";
    const area = base.area ? `${base.area} м²` : "";
    const comment = base.message ? "коммент:есть" : "коммент:нет";

    console.log(
      `${base.createdAt}  ${kind}  ${pad(status, 8)}  ${pad(base.city || "—", 14)}  ` +
        `${pad(maskName(base.name), 6)}  ${pad(maskPhone(base.phone), 12)}  ` +
        `${pad(workLabel(base), 24)} ${pad(area, 9)}  ${comment}`
    );
  }

  if (invalid > 0) {
    console.log("");
    console.log(`Пропущено битых строк: ${invalid}`);
  }
}

async function cmdBackup() {
  const filePath = resolveStoragePath();
  let info;

  try {
    info = await stat(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      console.error(`Нечего бэкапить: файл не найден (${filePath}).`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }

  const outDir = path.join(path.dirname(filePath), "backups");
  await mkdir(outDir, { recursive: true });

  const outPath = path.join(outDir, `${path.basename(filePath)}.${timestamp()}.bak`);
  await copyFile(filePath, outPath);

  console.log(`Бэкап создан: ${outPath}`);
  console.log(`Размер: ${Math.round(info.size / 1024)} KB`);
  console.log("Файл содержит PII — хранить вне git, не пересылать в открытых каналах.");
}

// Защита от CSV-инъекций (Excel/Sheets) + экранирование кавычек.
function csvCell(value) {
  let s = value === null || value === undefined ? "" : String(value);

  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }

  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

async function cmdExport(args) {
  const mask = args.includes("--mask");
  const outIndex = args.indexOf("--out");
  const explicitOut = outIndex >= 0 ? args[outIndex + 1] : null;

  const filePath = resolveStoragePath();
  const { records, invalid, missing } = await readRecords(filePath);

  if (missing) {
    console.error(`Нечего экспортировать: файл не найден (${filePath}).`);
    process.exitCode = 1;
    return;
  }

  const items = reconcile(records);
  const columns = [
    "id",
    "createdAt",
    "type",
    "status",
    "city",
    "name",
    "phone",
    "workType",
    "objectType",
    "area",
    "hasMessage"
  ];

  const rows = items.map(({ base, status }) => [
    base.id,
    base.createdAt,
    base.type,
    status,
    base.city ?? "",
    mask ? maskName(base.name) : base.name ?? "",
    mask ? maskPhone(base.phone) : base.phone ?? "",
    base.serviceType || base.workType || "",
    base.objectType ?? "",
    base.area ?? "",
    base.message ? "yes" : "no"
  ]);

  const suffix = mask ? "masked" : "full";
  const outPath = explicitOut
    ? path.resolve(explicitOut)
    : path.join(path.dirname(filePath), `leads-export-${suffix}-${timestamp()}.csv`);

  await mkdir(path.dirname(outPath), { recursive: true });
  // BOM — чтобы Excel корректно открыл кириллицу в UTF-8.
  await writeFile(outPath, `﻿${toCsv([columns, ...rows])}`, "utf8");

  console.log(`Экспортировано заявок: ${items.length}`);
  console.log(`Файл: ${outPath}`);

  if (invalid > 0) {
    console.log(`Пропущено битых строк: ${invalid}`);
  }

  if (mask) {
    console.log("Режим: маскированный (имя и телефон скрыты).");
  } else {
    console.log("Режим: полный — файл содержит PII (имя, телефон).");
    console.log("Не коммитить, не пересылать в открытых каналах, хранить вне git.");
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "summary":
      return cmdSummary();
    case "tail":
      return cmdTail(args);
    case "backup":
      return cmdBackup();
    case "export":
      return cmdExport(args);
    default:
      console.log("VG Контур — операции с локальным хранилищем заявок.");
      console.log("");
      console.log("Команды:");
      console.log("  node scripts/leads.mjs summary                         сводка по статусам");
      console.log("  node scripts/leads.mjs tail [N]                        последние N (маскировано), по умолчанию 10");
      console.log("  node scripts/leads.mjs backup                          копия с timestamp");
      console.log("  node scripts/leads.mjs export [--mask] [--out <path>]  CSV-экспорт");

      if (command && command !== "help") {
        process.exitCode = 1;
      }
  }
}

main().catch((error) => {
  // Безопасный вывод: только текст ошибки, без PII/payload.
  console.error(`Ошибка: ${error instanceof Error ? error.message : "unknown"}`);
  process.exitCode = 1;
});
