"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Send } from "lucide-react";
import {
  calculateEstimate,
  formatDateTime,
  formatDurationRange,
  formatEstimateRange,
  formatRateRange,
  type EstimateResult
} from "@/lib/estimate";
import { reachGoal } from "@/lib/metrica";
import { METRICA_GOALS } from "@/lib/metricaGoals";
import { PHONE_DISPLAY, PROJECT_NAME, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/contacts";

type LeadFormProps = {
  variant: "lead" | "calculator";
};

const cities = ["Ессентуки", "Кисловодск", "Железноводск", "Пятигорск", "Другой город КМВ"];

const workTypes = [
  "Отделочные работы",
  "Ремонт квартиры",
  "Ванная / санузел / плитка",
  "Электрика",
  "Строительство дома",
  "Кровля",
  "Кладка",
  "Нужна консультация"
];

const objectTypes = ["Квартира", "Дом", "Коммерческое помещение", "Санузел"];

const repairTypes = [
  "Отделка",
  "Косметический ремонт",
  "Комплексный ремонт",
  "Ванная / санузел / плитка",
  "Электрика",
  "Строительство"
];

type SubmitState = {
  status: "idle" | "sending" | "success" | "error";
  message: string;
};

function formDataToPayload(formData: FormData, variant: LeadFormProps["variant"]) {
  const base = {
    kind: variant,
    city: String(formData.get("city") || ""),
    comment: String(formData.get("comment") || ""),
    website: String(formData.get("website") || "")
  };

  if (variant === "calculator") {
    return {
      ...base,
      name: String(formData.get("name") || ""),
      objectType: String(formData.get("objectType") || ""),
      area: String(formData.get("area") || ""),
      repairType: String(formData.get("repairType") || ""),
      contact: String(formData.get("contact") || "")
    };
  }

  return {
    ...base,
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    workType: String(formData.get("workType") || "")
  };
}

export function LeadForm({ variant }: LeadFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: ""
  });
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  const isCalculator = variant === "calculator";
  const submitLabel = isCalculator ? "Получить предварительную оценку" : "Отправить заявку";
  const goal = isCalculator ? METRICA_GOALS.calculatorSubmit : METRICA_GOALS.formSubmit;
  const formClassName = useMemo(
    () => (isCalculator ? "lead-form calculator-form" : "lead-form"),
    [isCalculator]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({
      status: "sending",
      message: isCalculator ? "Считаем предварительную смету..." : "Отправляем заявку..."
    });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = formDataToPayload(formData, variant);
    const nextEstimate = isCalculator
      ? calculateEstimate({
          objectType: String(formData.get("objectType") || ""),
          area: String(formData.get("area") || ""),
          city: String(formData.get("city") || ""),
          repairType: String(formData.get("repairType") || ""),
          name: String(formData.get("name") || ""),
          phone: String(formData.get("contact") || ""),
          comment: String(formData.get("comment") || "")
        })
      : null;

    if (isCalculator) {
      if (!nextEstimate) {
        setSubmitState({
          status: "error",
          message: "Проверьте площадь и тип ремонта, чтобы получить предварительную смету."
        });
        return;
      }

      setEstimate(nextEstimate);
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        if (response.status === 400 || response.status === 429) {
          throw new Error(data.message || "Проверьте поля заявки.");
        }

        throw new Error("Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram.");
      }

      reachGoal(goal);
      form.reset();
      setSubmitState({
        status: "success",
        message:
          data.message ||
          (isCalculator
            ? "Предварительная смета сформирована и отправлена. Мы свяжемся с вами."
            : "Заявка отправлена. Мы свяжемся с вами.")
      });
    } catch (error) {
      const fallbackMessage = "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram.";
      const rawMessage = error instanceof Error ? error.message : "";
      const shouldHideRawMessage = /fetch|network|failed/i.test(rawMessage);

      setSubmitState({
        status: "error",
        message: rawMessage && !shouldHideRawMessage ? rawMessage : fallbackMessage
      });
    }
  }

  function handlePrintEstimate() {
    window.print();
  }

  return (
    <>
      <form className={formClassName} onSubmit={handleSubmit} noValidate>
        <input className="form-hp" name="website" tabIndex={-1} autoComplete="off" />

        {isCalculator ? (
          <>
            <label>
              <span>Имя</span>
              <input name="name" autoComplete="name" placeholder="Иван" required />
            </label>
            <label>
              <span>Контактный телефон</span>
              <input name="contact" autoComplete="tel" inputMode="tel" placeholder="+7 ___ ___-__-__" required />
            </label>
            <label>
              <span>Тип объекта</span>
              <select name="objectType" defaultValue="Квартира" required>
                {objectTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Площадь, м²</span>
              <input name="area" inputMode="decimal" placeholder="Например, 52" required />
            </label>
            <label>
              <span>Тип ремонта</span>
              <select name="repairType" defaultValue="Комплексный ремонт" required>
                {repairTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Город</span>
              <select name="city" defaultValue="Ессентуки" required>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-wide">
              <span>Комментарий</span>
              <textarea
                name="comment"
                rows={3}
                placeholder="Коротко опишите объект, сроки или важные детали"
              />
            </label>
          </>
        ) : (
          <>
            <label>
              <span>Имя</span>
              <input name="name" autoComplete="name" placeholder="Иван" required />
            </label>
            <label>
              <span>Телефон</span>
              <input name="phone" autoComplete="tel" inputMode="tel" placeholder="+7 ___ ___-__-__" required />
            </label>
            <label>
              <span>Город</span>
              <select name="city" defaultValue="Ессентуки" required>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Тип работ</span>
              <select name="workType" defaultValue="Ванная / санузел / плитка" required>
                {workTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-wide">
              <span>Комментарий</span>
              <textarea
                name="comment"
                rows={5}
                placeholder="Расскажите о задаче: объект, примерная площадь, что нужно сделать"
              />
            </label>
          </>
        )}

        <div className="form-actions">
          <button className="button button-primary" type="submit" disabled={submitState.status === "sending"}>
            <span>{submitState.status === "sending" ? "Отправляем..." : submitLabel}</span>
            {isCalculator ? <ArrowRight size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
          </button>
          <p className="form-consent">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и{" "}
            <Link href="/privacy">Политикой конфиденциальности</Link>.
          </p>
        </div>

        <p
          className={`form-status ${submitState.status === "error" ? "is-error" : ""}`}
          aria-live="polite"
        >
          {submitState.message}
        </p>
      </form>

      {isCalculator && estimate ? (
        <section className="estimate-result printable-estimate" aria-label="Предварительная смета">
          <div className="estimate-result-header">
            <div>
              <p className="eyebrow">Предварительная смета</p>
              <h3>{PROJECT_NAME}</h3>
            </div>
            <p>{formatDateTime(estimate.calculatedAt)}</p>
          </div>

          <dl className="estimate-details">
            <div>
              <dt>Телефон</dt>
              <dd>{PHONE_DISPLAY}</dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>{WHATSAPP_URL}</dd>
            </div>
            <div>
              <dt>Telegram</dt>
              <dd>{TELEGRAM_URL}</dd>
            </div>
            <div>
              <dt>Тип объекта</dt>
              <dd>{estimate.objectType}</dd>
            </div>
            <div>
              <dt>Площадь</dt>
              <dd>{estimate.area} м²</dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>{estimate.city}</dd>
            </div>
            <div>
              <dt>Тип ремонта</dt>
              <dd>{estimate.repairType}</dd>
            </div>
            <div>
              <dt>Временная ставка</dt>
              <dd>{formatRateRange(estimate)}</dd>
            </div>
            <div>
              <dt>Предварительная стоимость</dt>
              <dd>{formatEstimateRange(estimate)}</dd>
            </div>
            <div>
              <dt>Примерный срок</dt>
              <dd>{formatDurationRange(estimate)}</dd>
            </div>
          </dl>

          <p className="estimate-disclaimer">{estimate.disclaimer}</p>
          <p className="estimate-rate-note">{estimate.rateNote}</p>

          <button className="button button-secondary estimate-print-button" type="button" onClick={handlePrintEstimate}>
            <Download size={18} aria-hidden="true" />
            <span>Скачать смету</span>
          </button>
        </section>
      ) : null}
    </>
  );
}
