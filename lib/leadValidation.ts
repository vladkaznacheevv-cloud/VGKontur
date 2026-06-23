export type LeadKind = "lead" | "calculator";

export type LeadPayload = {
  kind?: LeadKind;
  name?: string;
  phone?: string;
  city?: string;
  workType?: string;
  comment?: string;
  objectType?: string;
  area?: string;
  repairType?: string;
  contact?: string;
  website?: string;
};

export type NormalizedLead = {
  kind: LeadKind;
  name: string;
  phone: string;
  city: string;
  workType: string;
  comment: string;
  objectType?: string;
  area?: string;
  repairType?: string;
};

const WORK_TYPES = new Set([
  "Отделочные работы",
  "Ремонт квартиры",
  "Ванная / санузел / плитка",
  "Электрика",
  "Строительство дома",
  "Кровля",
  "Кладка",
  "Нужна консультация"
]);

const OBJECT_TYPES = new Set(["Квартира", "Дом", "Коммерческое помещение", "Санузел"]);
const REPAIR_TYPES = new Set([
  "Отделка",
  "Косметический ремонт",
  "Комплексный ремонт",
  "Дизайнерский ремонт",
  "Ванная / санузел / плитка",
  "Электрика",
  "Строительство"
]);

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanPhone(value: unknown) {
  return cleanText(value, 40).replace(/[^\d+()\-\s]/g, "");
}

function requireText(value: string, field: string, minLength = 2) {
  if (value.length < minLength) {
    throw new Error(`Поле "${field}" заполнено некорректно.`);
  }
}

function requireOption(value: string, allowed: Set<string>, field: string) {
  if (!allowed.has(value)) {
    throw new Error(`Выберите корректное значение поля "${field}".`);
  }
}

function normalizeArea(value: unknown) {
  const area = cleanText(value, 12).replace(",", ".");
  const parsed = Number(area);

  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 1000) {
    throw new Error("Укажите площадь от 1 до 1000 м².");
  }

  return String(Math.round(parsed * 10) / 10);
}

export function normalizeLead(payload: LeadPayload): NormalizedLead {
  const kind: LeadKind = payload.kind === "calculator" ? "calculator" : "lead";
  const name = cleanText(
    kind === "calculator" ? payload.name || "Заявка с калькулятора" : payload.name,
    80
  );
  const phone = cleanPhone(payload.phone || payload.contact);
  const city = cleanText(payload.city, 80);
  const comment = cleanText(payload.comment, 800);

  requireText(name, "имя");
  requireText(city, "город");

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 16) {
    throw new Error("Укажите корректный телефон.");
  }

  if (kind === "calculator") {
    const objectType = cleanText(payload.objectType, 80);
    const repairType = cleanText(payload.repairType, 80);
    const area = normalizeArea(payload.area);

    requireOption(objectType, OBJECT_TYPES, "тип объекта");
    requireOption(repairType, REPAIR_TYPES, "тип ремонта");

    return {
      kind,
      name,
      phone,
      city,
      workType: repairType,
      comment,
      objectType,
      area,
      repairType
    };
  }

  const workType = cleanText(payload.workType, 100);
  requireOption(workType, WORK_TYPES, "тип работ");

  return {
    kind,
    name,
    phone,
    city,
    workType,
    comment
  };
}

export function isHoneypotFilled(payload: LeadPayload) {
  return cleanText(payload.website, 120).length > 0;
}
