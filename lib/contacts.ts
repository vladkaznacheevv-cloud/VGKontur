export const PHONE_DISPLAY = "+7 (962) 003-35-74";
export const PHONE_TEL = "+79620033574";
export const WHATSAPP_URL = "https://wa.me/79620033574";
const CONFIGURED_TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL;
export const TELEGRAM_URL =
  CONFIGURED_TELEGRAM_URL && CONFIGURED_TELEGRAM_URL !== "https://t.me/placeholder"
    ? CONFIGURED_TELEGRAM_URL
    : "https://t.me/VGKontur";

export const PROJECT_NAME = "VG Контур";
export const PROJECT_HEADER_NAME = "VG КОНТУР";
export const PROJECT_DESCRIPTOR = "Ремонт и отделка по КМВ";
export const PROJECT_SLOGAN = "Ремонт без хаоса: замер, смета, контроль";

export const SITE_URL = "https://vgkontur.ru";
export const CONTACT_EMAIL = "vlad.kaznacheevv@gmail.com";

// Публичные регистрационные данные оператора ПДн (не секрет, не PII клиентов).
// Используются на странице /privacy как единый источник.
export const PERSONAL_DATA_OPERATOR = {
  legalForm: "Индивидуальный предприниматель",
  fullName: "Казначеев Владислав Сергеевич",
  inn: "262610640023",
  ogrnip: "324265100007638",
  region: "Ставропольский край, г. Ессентуки",
  responsiblePerson: "Казначеев Владислав Сергеевич"
} as const;
