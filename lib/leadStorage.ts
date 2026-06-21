import { appendFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { NormalizedLead } from "./leadValidation";

/**
 * Локальное аварийное хранилище заявок и предварительных смет (NDJSON).
 *
 * Цель: заявка не должна теряться при временном сбое Telegram/API.
 * Запись делается ДО отправки в Telegram, после попытки дописывается
 * компактная status-строка (linked by id).
 *
 * Формат файла — NDJSON, одна JSON-строка на событие:
 *  - основная запись:  type = "lead" | "estimate"
 *  - статус доставки:  type = "status" (linked by id)
 *
 * Безопасность: файл содержит PII (имя/телефон) и не должен попадать в git
 * или в логи. В консоль наружу пишется только безопасный маркер без PII.
 */

export type TelegramDeliveryStatus = "pending" | "sent" | "failed";

export type LeadRecord = {
  id: string;
  createdAt: string;
  type: "lead" | "estimate";
  source: "site";
  city: string;
  name: string;
  phone: string;
  workType?: string;
  serviceType?: string;
  objectType?: string;
  area?: string;
  message?: string;
  telegramDeliveryStatus: TelegramDeliveryStatus;
  telegramErrorSafe: string | null;
};

type StatusRecord = {
  id: string;
  type: "status";
  updatedAt: string;
  telegramDeliveryStatus: Exclude<TelegramDeliveryStatus, "pending">;
  telegramErrorSafe: string | null;
};

function resolveStoragePath() {
  const fromEnv = process.env.LEADS_STORAGE_PATH?.trim();

  if (fromEnv) {
    return path.resolve(fromEnv);
  }

  return path.resolve(process.cwd(), "storage", "leads.ndjson");
}

function safeErrorCode(error: unknown) {
  if (error instanceof Error && "code" in error && typeof error.code === "string") {
    return error.code;
  }

  return "unknown";
}

async function appendLine(record: LeadRecord | StatusRecord) {
  const filePath = resolveStoragePath();

  // Авто-создание папки storage (или каталога из LEADS_STORAGE_PATH).
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
}

/**
 * Сохраняет валидированную заявку/смету локально ДО отправки в Telegram.
 * Никогда не бросает исключение, чтобы не ломать основной поток заявки.
 */
export async function saveLeadRecord(lead: NormalizedLead): Promise<{ id: string }> {
  const id = randomUUID();

  const record: LeadRecord = {
    id,
    createdAt: new Date().toISOString(),
    type: lead.kind === "calculator" ? "estimate" : "lead",
    source: "site",
    city: lead.city,
    name: lead.name,
    phone: lead.phone,
    telegramDeliveryStatus: "pending",
    telegramErrorSafe: null
  };

  if (lead.workType) {
    record.workType = lead.workType;
  }
  if (lead.repairType) {
    record.serviceType = lead.repairType;
  }
  if (lead.objectType) {
    record.objectType = lead.objectType;
  }
  if (lead.area) {
    record.area = lead.area;
  }
  if (lead.comment) {
    record.message = lead.comment;
  }

  try {
    await appendLine(record);
  } catch (error) {
    // Не логируем PII/содержимое заявки — только безопасный маркер и код ошибки.
    console.error(`[leadStorage] failed to persist incoming lead (${safeErrorCode(error)})`);
  }

  return { id };
}

/**
 * Дописывает финальный статус доставки в Telegram (linked by id).
 * Никогда не бросает исключение.
 */
export async function updateLeadDeliveryStatus(
  id: string,
  status: Exclude<TelegramDeliveryStatus, "pending">,
  telegramErrorSafe: string | null = null
) {
  const record: StatusRecord = {
    id,
    type: "status",
    updatedAt: new Date().toISOString(),
    telegramDeliveryStatus: status,
    telegramErrorSafe
  };

  try {
    await appendLine(record);
  } catch (error) {
    console.error(`[leadStorage] failed to persist delivery status (${safeErrorCode(error)})`);
  }
}
