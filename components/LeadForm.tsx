"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Phone, Ruler, Send } from "lucide-react";
import {
  CALCULATOR_DISCLAIMER,
  CALCULATOR_REPAIR_TYPES,
  OBJECT_STATES,
  calculateEstimate,
  formatDate,
  formatEstimateFromTo,
  formatRateRange,
  parseEstimateArea,
  type EstimateResult
} from "@/lib/estimate";
import { reachGoal } from "@/lib/metrica";
import { METRICA_GOALS } from "@/lib/metricaGoals";
import { BrandLogo } from "@/components/BrandLogo";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  PROJECT_DESCRIPTOR,
  PROJECT_NAME,
  SITE_URL,
  TELEGRAM_URL,
  WHATSAPP_URL
} from "@/lib/contacts";

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

type SubmitState = {
  status: "idle" | "sending" | "success" | "error";
  message: string;
};

export function LeadForm({ variant }: LeadFormProps) {
  if (variant === "calculator") {
    return <CalculatorWidget />;
  }

  return <LeadRequestForm />;
}

// ───────────────────────── Заявка на замер (без изменений по логике) ─────────────────────────

function LeadRequestForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "sending", message: "Отправляем заявку..." });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      kind: "lead" as const,
      city: String(formData.get("city") || ""),
      comment: String(formData.get("comment") || ""),
      website: String(formData.get("website") || ""),
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      workType: String(formData.get("workType") || "")
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        if (response.status === 400 || response.status === 429) {
          throw new Error(data.message || "Проверьте поля заявки.");
        }

        throw new Error("Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram.");
      }

      reachGoal(METRICA_GOALS.formSubmit);
      form.reset();
      setSubmitState({
        status: "success",
        message: data.message || "Заявка отправлена. Мы свяжемся с вами."
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

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <input className="form-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

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

      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={submitState.status === "sending"}>
          <span>{submitState.status === "sending" ? "Отправляем..." : "Отправить заявку"}</span>
          <Send size={18} aria-hidden="true" />
        </button>
        <p className="form-consent">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и{" "}
          <Link href="/privacy">Политикой конфиденциальности</Link>.
        </p>
      </div>

      <p className={`form-status ${submitState.status === "error" ? "is-error" : ""}`} aria-live="polite">
        {submitState.message}
      </p>
    </form>
  );
}

// ───────────────────────── Интерактивный калькулятор + печатная смета ─────────────────────────

const AREA_MIN = 3;
const AREA_MAX = 200;

function CalculatorWidget() {
  const [repairType, setRepairType] = useState<string>("Комплексный ремонт");
  const [objectState, setObjectState] = useState<string>("Вторичка");
  const [area, setArea] = useState<string>("50");
  const [objectType, setObjectType] = useState<string>("Квартира");
  const [city, setCity] = useState<string>("Ессентуки");
  const [now, setNow] = useState<string>("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });

  // Дата формирования сметы вычисляется на клиенте, чтобы избежать рассинхрона гидратации.
  useEffect(() => {
    setNow(new Date().toISOString());
  }, []);

  const isElectric = repairType === "Электрика";

  const estimate = useMemo<EstimateResult | null>(
    () =>
      calculateEstimate(
        { objectType, area, city, repairType, objectState },
        now || undefined
      ),
    [objectType, area, city, repairType, objectState, now]
  );

  const sliderValue = useMemo(() => {
    const parsed = parseEstimateArea(area);
    if (!parsed) {
      return AREA_MIN;
    }
    return Math.min(AREA_MAX, Math.max(AREA_MIN, Math.round(parsed)));
  }, [area]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const phone = String(formData.get("contact") || "");
    const userComment = String(formData.get("comment") || "");
    const website = String(formData.get("website") || "");

    if (!estimate) {
      setSubmitState({
        status: "error",
        message: "Проверьте площадь и тип работ, чтобы получить предварительную оценку."
      });
      return;
    }

    setSubmitState({ status: "sending", message: "Отправляем расчёт..." });

    // Состояние объекта и ориентир по работам передаём команде в комментарии —
    // без изменения контракта API, Telegram и хранилища заявок.
    const enrichedComment = [
      objectState ? `Состояние объекта: ${objectState}.` : "",
      `Ориентир по работам: ${formatEstimateFromTo(estimate)} (${repairType}, ${estimate.area} м²).`,
      userComment.trim()
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 800);

    const payload = {
      kind: "calculator" as const,
      name,
      contact: phone,
      objectType,
      area,
      repairType,
      city,
      comment: enrichedComment,
      website
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        if (response.status === 400 || response.status === 429) {
          throw new Error(data.message || "Проверьте поля заявки.");
        }

        throw new Error("Не удалось отправить расчёт. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram.");
      }

      reachGoal(METRICA_GOALS.calculatorSubmit);
      form.reset();
      setSubmitState({
        status: "success",
        message: data.message || "Расчёт отправлен в VG Контур. Мы свяжемся с вами и согласуем замер."
      });
    } catch (error) {
      const fallbackMessage = "Не удалось отправить расчёт. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram.";
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
    <div className="calc-widget">
      <div className="calc-controls" role="group" aria-label="Параметры предварительной оценки">
        <fieldset className="segmented">
          <legend className="segmented-legend">Уровень работ</legend>
          <div className="segmented-options">
            {CALCULATOR_REPAIR_TYPES.map((item) => (
              <label className="segmented-option" key={item}>
                <input
                  type="radio"
                  name="calc-repair-type"
                  value={item}
                  checked={repairType === item}
                  onChange={() => setRepairType(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="calc-area">
          <div className="calc-area-head">
            <label htmlFor="calc-area-input">Площадь, м²</label>
            <input
              id="calc-area-input"
              className="calc-area-input"
              inputMode="decimal"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              aria-label="Площадь в квадратных метрах"
            />
          </div>
          <input
            className="calc-area-slider"
            type="range"
            min={AREA_MIN}
            max={AREA_MAX}
            step={1}
            value={sliderValue}
            onChange={(event) => setArea(event.target.value)}
            aria-label="Площадь, ползунок"
            disabled={isElectric}
          />
          {isElectric ? (
            <p className="calc-hint">Для электрики площадь не влияет на расчёт — считаем по объёму работ.</p>
          ) : null}
        </div>

        <fieldset className="segmented">
          <legend className="segmented-legend">Состояние объекта</legend>
          <div className="segmented-options segmented-options-3">
            {OBJECT_STATES.map((item) => (
              <label className="segmented-option" key={item}>
                <input
                  type="radio"
                  name="calc-object-state"
                  value={item}
                  checked={objectState === item}
                  onChange={() => setObjectState(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {estimate ? (
        <section className="estimate-sheet printable-estimate" aria-label="Предварительная оценка стоимости работ">
          <header className="estimate-sheet-head">
            <div className="estimate-sheet-brand">
              <span className="estimate-sheet-mark" aria-hidden="true">
                <BrandLogo className="brand-logo" />
              </span>
              <span className="estimate-sheet-brand-text">
                <strong>{PROJECT_NAME}</strong>
                <small>{PROJECT_DESCRIPTOR}</small>
              </span>
            </div>
            <div className="estimate-sheet-contacts">
              <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              <span className="estimate-sheet-channels">
                WhatsApp: {WHATSAPP_URL.replace("https://", "")} · Telegram:{" "}
                {TELEGRAM_URL.replace("https://", "")}
              </span>
            </div>
          </header>

          <div className="estimate-sheet-title">
            <p className="estimate-sheet-eyebrow">Предварительная оценка стоимости работ</p>
            {now ? <p className="estimate-sheet-date">Сформировано: {formatDate(estimate.calculatedAt)}</p> : null}
          </div>

          <div className="estimate-headline">
            <span className="estimate-headline-label">Ориентир по работам</span>
            <strong className="estimate-headline-value">{formatEstimateFromTo(estimate)}</strong>
            <span className="estimate-headline-meta">
              {repairType}
              {!isElectric ? ` · ${estimate.area} м²` : ""}
              {objectState ? ` · ${objectState}` : ""}
            </span>
          </div>

          <dl className="estimate-params">
            <div>
              <dt>Тип работ</dt>
              <dd>{repairType}</dd>
            </div>
            <div>
              <dt>Тип объекта</dt>
              <dd>{objectType}</dd>
            </div>
            {!isElectric ? (
              <div>
                <dt>Площадь</dt>
                <dd>{estimate.area} м²</dd>
              </div>
            ) : null}
            <div>
              <dt>Состояние</dt>
              <dd>{objectState || "Уточняется"}</dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>{city}</dd>
            </div>
            <div>
              <dt>{isElectric ? "Расчёт" : "Ориентир по м²"}</dt>
              <dd>{formatRateRange(estimate)}</dd>
            </div>
          </dl>

          <p className="estimate-influence">
            <strong>Что влияет на итог:</strong> {estimate.influence}
          </p>

          <p className="estimate-cta-note">
            <Ruler size={17} aria-hidden="true" />
            <span>Для точной сметы нужен замер объекта — выезд по Ессентукам и КМВ бесплатный.</span>
          </p>

          {/* Дисклеймер показываем один раз — в печатной/PDF-смете. */}
          <p className="estimate-sheet-disclaimer print-only">{CALCULATOR_DISCLAIMER}</p>

          <footer className="estimate-sheet-foot print-only">
            <span>
              {PROJECT_NAME} · {SITE_URL.replace("https://", "")} · {PHONE_DISPLAY}
            </span>
            <span>WhatsApp {WHATSAPP_URL.replace("https://", "")} · Telegram {TELEGRAM_URL.replace("https://", "")}</span>
          </footer>

          <div className="estimate-actions screen-only">
            <button className="button button-secondary" type="button" onClick={handlePrintEstimate}>
              <Download size={18} aria-hidden="true" />
              <span>Скачать предварительную смету</span>
            </button>
            <a className="button button-ghost" href="#lead-form">
              <Ruler size={18} aria-hidden="true" />
              <span>Вызвать замерщика</span>
            </a>
          </div>
        </section>
      ) : null}

      <div className="calc-next screen-only">
        <p className="calc-next-title">Что дальше после расчёта</p>
        <ul className="calc-next-list">
          <li>Бесплатный замер в удобное время — инженер осмотрит объект.</li>
          <li>Точная смета после осмотра: материалы, скрытые работы и объём.</li>
          <li>Фиксируем состав работ и цену до старта — без доплат «по ходу».</li>
        </ul>
      </div>

      <form className="lead-form calc-send" onSubmit={handleSubmit} noValidate>
        <input className="form-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <p className="calc-send-lead screen-only">
          Отправьте расчёт в VG Контур — перезвоним, уточним детали и согласуем бесплатный замер.
        </p>

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
          <select name="objectType" value={objectType} onChange={(event) => setObjectType(event.target.value)} required>
            {objectTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Город</span>
          <select name="city" value={city} onChange={(event) => setCity(event.target.value)} required>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="form-wide">
          <span>Комментарий</span>
          <textarea name="comment" rows={3} placeholder="Коротко опишите объект, сроки или важные детали" />
        </label>

        <div className="form-actions">
          <button className="button button-primary" type="submit" disabled={submitState.status === "sending"}>
            <span>{submitState.status === "sending" ? "Отправляем..." : "Отправить расчёт в VG Контур"}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <div className="calc-send-secondary">
            <a className="calc-call-link" href={`tel:${PHONE_TEL}`}>
              <Phone size={16} aria-hidden="true" />
              <span>Получить точную смету после замера</span>
            </a>
          </div>
          <p className="form-consent">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и{" "}
            <Link href="/privacy">Политикой конфиденциальности</Link>.
          </p>
        </div>

        <p className={`form-status ${submitState.status === "error" ? "is-error" : ""}`} aria-live="polite">
          {submitState.message}
        </p>
      </form>
    </div>
  );
}
