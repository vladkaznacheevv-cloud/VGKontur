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
