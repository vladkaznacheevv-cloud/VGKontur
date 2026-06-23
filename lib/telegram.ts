import type { NormalizedLead } from "./leadValidation";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatTelegramMessage(lead: NormalizedLead) {
  const title =
    lead.kind === "calculator"
      ? "🧾 Отправлена новая предварительная смета"
      : "Новая заявка на замер";

  const lines = [
    `<b>${title}</b>`,
    "",
    `<b>Статус:</b> новая заявка`,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Город:</b> ${escapeHtml(lead.city)}`
  ];

  if (lead.objectType) {
    lines.push(`<b>Тип объекта:</b> ${escapeHtml(lead.objectType)}`);
  }

  if (lead.area) {
    lines.push(`<b>Площадь:</b> ${escapeHtml(lead.area)} м²`);
  }

  lines.push(`<b>Тип работ:</b> ${escapeHtml(lead.workType)}`);

  // Единый источник цифр: для заявок из калькулятора ориентир по бюджету
  // (с учётом состояния объекта) формируется на клиенте через lib/estimate.ts
  // и передаётся в комментарии. Здесь сумму не пересчитываем, чтобы значения
  // в Telegram не конфликтовали с калькулятором и печатной/PDF-сметой.
  if (lead.comment) {
    lines.push(`<b>Комментарий:</b> ${escapeHtml(lead.comment)}`);
  }

  lines.push("");
  lines.push("Источник: MVP сайт, Ессентуки.");

  return lines.join("\n");
}

export async function sendLeadToTelegram(lead: NormalizedLead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, reason: "missing_config" as const };
  }

  let response: Response;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: chatId,
        text: formatTelegramMessage(lead),
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
  } catch {
    return { ok: false, reason: "telegram_error" as const };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    return { ok: false, reason: "telegram_error" as const };
  }

  return { ok: true, reason: "sent" as const };
}
