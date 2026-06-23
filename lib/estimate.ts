export const ESTIMATE_DISCLAIMER =
  "Стоимость предварительная. Точная смета составляется после замера специалиста и зависит от состояния объекта, материалов и объёма работ.";

// Дисклеймер для печатной/PDF-сметы (на экране используется более короткий вариант ниже).
export const CALCULATOR_DISCLAIMER =
  "Расчёт предварительный и показывает ориентир по стоимости работ. Материалы, сантехника, электрика, демонтаж, состояние стен и пола уточняются после замера.";

// Короткий продающий текст карточки результата — доводит до замера без повторов.
export const ESTIMATE_RESULT_PITCH =
  "Чтобы закрепить состав работ и цену, инженер бесплатно осмотрит объект и подготовит смету.";

// Ненавязчивый дисклеймер карточки результата на экране (показывается один раз).
export const ESTIMATE_RESULT_DISCLAIMER =
  "Материалы, демонтаж, электрика, сантехника и состояние оснований уточняются после замера.";

// Рабочие ставки калькулятора — утверждённый ориентир VG Контур.
export const ESTIMATE_RATE_NOTE =
  "Рабочие ставки для предварительного расчёта. Финальная смета формируется после замера.";

// Состояние объекта влияет на объём подготовки (демонтаж, основания, скрытые работы).
export const OBJECT_STATES = ["Новостройка", "Вторичка", "Сложный объект"] as const;
export type ObjectState = (typeof OBJECT_STATES)[number];

// Уровни ремонта, доступные в интерактивном калькуляторе на сайте.
export const CALCULATOR_REPAIR_TYPES = [
  "Косметический ремонт",
  "Комплексный ремонт",
  "Дизайнерский ремонт",
  "Ванная / санузел / плитка",
  "Электрика"
] as const;
export type CalculatorRepairType = (typeof CALCULATOR_REPAIR_TYPES)[number];

export type PricingModel = "per_m2" | "fixed";

export type EstimateInput = {
  objectType: string;
  area: string;
  city: string;
  repairType: string;
  objectState?: string;
  name?: string;
  phone?: string;
  comment?: string;
};

export type EstimateResult = {
  objectType: string;
  area: number;
  city: string;
  repairType: string;
  objectState: string;
  pricingModel: PricingModel;
  rateMin: number;
  rateMax: number;
  totalMin: number;
  totalMax: number;
  durationMin: number;
  durationMax: number;
  calculatedAt: string;
  disclaimer: string;
  rateNote: string;
  influence: string;
};

type RepairConfig = {
  model: PricingModel;
  // per_m2: ставки за м² работ; fixed: фиксированный диапазон за объект.
  perM2Min?: number;
  perM2Max?: number;
  fixedMin?: number;
  fixedMax?: number;
  // Минимальный выездной объект — нижняя планка диапазона.
  floorMin: number;
  floorMax: number;
  daysMin: number;
  daysMax: number;
  // Что влияет на итог — короткое честное пояснение под результатом и в смете.
  influence: string;
};

// Рабочие ставки VG Контур для предварительного расчёта (финальная смета — после замера).
const REPAIR_CONFIG: Record<string, RepairConfig> = {
  "Косметический ремонт": {
    model: "per_m2",
    perM2Min: 8000,
    perM2Max: 10500,
    floorMin: 60000,
    floorMax: 80000,
    daysMin: 0.2,
    daysMax: 0.36,
    influence:
      "Состояние стен и пола, объём подготовки и площадь влияют на итоговую смету."
  },
  "Комплексный ремонт": {
    model: "per_m2",
    perM2Min: 18000,
    perM2Max: 30000,
    floorMin: 60000,
    floorMax: 80000,
    daysMin: 0.35,
    daysMax: 0.58,
    influence:
      "Демонтаж, выравнивание оснований, электрика и сантехника сильно влияют на итог."
  },
  "Дизайнерский ремонт": {
    model: "per_m2",
    perM2Min: 25000,
    perM2Max: 35000,
    floorMin: 80000,
    floorMax: 120000,
    daysMin: 0.45,
    daysMax: 0.7,
    influence:
      "Сложность проекта, материалы и объём декоративных работ определяют итоговую смету."
  },
  "Ванная / санузел / плитка": {
    model: "per_m2",
    perM2Min: 25000,
    perM2Max: 55000,
    floorMin: 120000,
    floorMax: 120000,
    daysMin: 0.75,
    daysMax: 1.25,
    influence:
      "Гидроизоляция, разводка сантехники, раскладка и формат плитки влияют на итог."
  },
  "Электрика": {
    model: "fixed",
    fixedMin: 25000,
    fixedMax: 40000,
    floorMin: 25000,
    floorMax: 40000,
    daysMin: 3,
    daysMax: 7,
    influence:
      "Точный расчёт электрики зависит от количества точек, щита, трасс и состояния проводки."
  },
  // Совместимость: значения остаются в допустимом наборе на сервере.
  "Отделка": {
    model: "per_m2",
    perM2Min: 8000,
    perM2Max: 14000,
    floorMin: 60000,
    floorMax: 80000,
    daysMin: 0.18,
    daysMax: 0.32,
    influence: "Состояние поверхностей, площадь и объём подготовки влияют на итог."
  },
  "Строительство": {
    model: "per_m2",
    perM2Min: 35000,
    perM2Max: 65000,
    floorMin: 60000,
    floorMax: 80000,
    daysMin: 0.8,
    daysMax: 1.45,
    influence: "Тип конструкции, площадь и состав работ определяют итоговую смету."
  }
};

// Состояние объекта смещает диапазон: новостройка ближе к нижней границе,
// вторичка и сложный объект требуют больше подготовки и скрытых работ.
const STATE_FACTORS: Record<string, { min: number; max: number }> = {
  "Новостройка": { min: 1, max: 0.95 },
  "Вторичка": { min: 1.08, max: 1 },
  "Сложный объект": { min: 1.2, max: 1.1 }
};

function roundToThousand(value: number) {
  return Math.max(0, Math.round(value / 1000) * 1000);
}

export function parseEstimateArea(area: string) {
  const normalized = area.replace(",", ".").trim();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed * 10) / 10;
}

export function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long"
  }).format(new Date(value));
}

export function formatEstimateRange(estimate: EstimateResult) {
  return `${formatRub(estimate.totalMin)} - ${formatRub(estimate.totalMax)}`;
}

// «от … до …» — формулировка для интерфейса и печатной сметы (не «финальная цена»).
export function formatEstimateFromTo(estimate: EstimateResult) {
  return `от ${formatRub(estimate.totalMin)} до ${formatRub(estimate.totalMax)}`;
}

export function formatRateRange(estimate: EstimateResult) {
  if (estimate.pricingModel === "fixed") {
    return "зависит от объёма работ";
  }

  return `${formatRub(estimate.rateMin)} - ${formatRub(estimate.rateMax)} за м²`;
}

export function formatDurationRange(estimate: EstimateResult) {
  return `${estimate.durationMin}-${estimate.durationMax} рабочих дней`;
}

export function calculateEstimate(input: EstimateInput, calculatedAt = new Date().toISOString()) {
  const area = parseEstimateArea(input.area);
  const config = REPAIR_CONFIG[input.repairType];

  if (!area || !config) {
    return null;
  }

  const objectState =
    input.objectState && STATE_FACTORS[input.objectState] ? input.objectState : "";

  let totalMin: number;
  let totalMax: number;
  let rateMin = 0;
  let rateMax = 0;
  let durationMin: number;
  let durationMax: number;

  if (config.model === "fixed") {
    // Электрика: не считаем по м² — показываем минимальный ориентир по объекту.
    totalMin = config.fixedMin ?? config.floorMin;
    totalMax = config.fixedMax ?? config.floorMax;
    durationMin = config.daysMin;
    durationMax = config.daysMax;
  } else {
    rateMin = config.perM2Min ?? 0;
    rateMax = config.perM2Max ?? 0;

    // Состояние объекта смещает диапазон (демонтаж/подготовка/скрытые работы).
    const factor = objectState ? STATE_FACTORS[objectState] : { min: 1, max: 1 };
    const rawMin = area * rateMin * factor.min;
    const rawMax = area * rateMax * factor.max;

    totalMin = roundToThousand(Math.max(rawMin, config.floorMin));
    totalMax = roundToThousand(Math.max(rawMax, config.floorMax, totalMin + 1000));

    durationMin = Math.max(3, Math.ceil(area * config.daysMin));
    durationMax = Math.max(durationMin + 2, Math.ceil(area * config.daysMax));
  }

  return {
    objectType: input.objectType,
    area,
    city: input.city,
    repairType: input.repairType,
    objectState,
    pricingModel: config.model,
    rateMin,
    rateMax,
    totalMin,
    totalMax,
    durationMin,
    durationMax,
    calculatedAt,
    disclaimer: ESTIMATE_DISCLAIMER,
    rateNote: ESTIMATE_RATE_NOTE,
    influence: config.influence
  } satisfies EstimateResult;
}
