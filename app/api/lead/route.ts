import { NextResponse } from "next/server";
import { isHoneypotFilled, normalizeLead, type LeadPayload } from "@/lib/leadValidation";
import { sendLeadToTelegram } from "@/lib/telegram";
import { saveLeadRecord, updateLeadDeliveryStatus } from "@/lib/leadStorage";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);

  if (!current || current.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { ok: false, message: "Слишком много заявок. Попробуйте позже." },
      { status: 429 }
    );
  }

  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Не удалось прочитать заявку." },
      { status: 400 }
    );
  }

  if (isHoneypotFilled(payload)) {
    return NextResponse.json({ ok: true, message: "Заявка принята." });
  }

  try {
    const lead = normalizeLead(payload);

    // Сохраняем валидированную заявку локально ДО отправки в Telegram,
    // чтобы временный сбой Telegram/API не приводил к потере заявки.
    const { id } = await saveLeadRecord(lead);

    const result = await sendLeadToTelegram(lead);

    if (result.reason === "missing_config") {
      await updateLeadDeliveryStatus(id, "failed", "missing_config");
      return NextResponse.json(
        {
          ok: false,
          message: "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram."
        },
        { status: 503 }
      );
    }

    if (!result.ok) {
      await updateLeadDeliveryStatus(id, "failed", result.reason);
      return NextResponse.json(
        {
          ok: false,
          message: "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram."
        },
        { status: 502 }
      );
    }

    await updateLeadDeliveryStatus(id, "sent");

    return NextResponse.json({
      ok: true,
      message:
        lead.kind === "calculator"
          ? "Предварительная смета отправлена. Мы свяжемся с вами."
          : "Заявка отправлена. Мы свяжемся с вами."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Проверьте поля заявки.";
    const safeMessage = /fetch|network|failed/i.test(message)
      ? "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram."
      : message;

    return NextResponse.json({ ok: false, message: safeMessage }, { status: 400 });
  }
}
