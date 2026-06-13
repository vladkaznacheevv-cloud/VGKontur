import type { NormalizedLead } from "./leadValidation";
import {
  calculateEstimate,
  formatDateTime,
  formatDurationRange,
  formatEstimateRange,
  formatRateRange
} from "./estimate";

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
  const estimate =
    lead.kind === "calculator" && lead.objectType && lead.area && lead.repairType
      ? calculateEstimate({
          objectType: lead.objectType,
          area: lead.area,
          city: lead.city,
          repairType: lead.repairType,
          name: lead.name,
          phone: lead.phone,
          comment: lead.comment
        })
      : null;

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

  if (lead.comment) {
    lines.push(`<b>Комментарий:</b> ${escapeHtml(lead.comment)}`);
  }

  if (estimate) {
    lines.push("");
    lines.push(`<b>Предварительная стоимость:</b> ${escapeHtml(formatEstimateRange(estimate))}`);
    lines.push(`<b>Временная ставка:</b> ${escapeHtml(formatRateRange(estimate))}`);
    lines.push(`<b>Примерный срок:</b> ${escapeHtml(formatDurationRange(estimate))}`);
    lines.push(`<b>Дата расчёта:</b> ${escapeHtml(formatDateTime(estimate.calculatedAt))}`);
    lines.push(`<b>Дисклеймер:</b> ${escapeHtml(estimate.disclaimer)}`);
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
