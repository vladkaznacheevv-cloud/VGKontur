export const ESTIMATE_DISCLAIMER =
  "Стоимость предварительная. Точная смета составляется после замера специалиста и зависит от состояния объекта, материалов и объёма работ.";

export const ESTIMATE_RATE_TODO = "TODO: уточнить по Ставропольскому краю.";

export type EstimateInput = {
  objectType: string;
  area: string;
  city: string;
  repairType: string;
  name?: string;
  phone?: string;
  comment?: string;
};

export type EstimateResult = {
  objectType: string;
  area: number;
  city: string;
  repairType: string;
  rateMin: number;
  rateMax: number;
  totalMin: number;
  totalMax: number;
  durationMin: number;
  durationMax: number;
  calculatedAt: string;
  disclaimer: string;
  rateNote: string;
};

type RateRow = {
  min: number;
  max: number;
  daysPerSquareMeterMin: number;
  daysPerSquareMeterMax: number;
};

// Conservative MVP placeholders. TODO: уточнить по Ставропольскому краю.
export const ESTIMATE_RATE_TABLE: Record<string, RateRow> = {
  "Отделка": {
    min: 8000,
    max: 14000,
    daysPerSquareMeterMin: 0.18,
    daysPerSquareMeterMax: 0.32
  },
  "Косметический ремонт": {
    min: 9000,
    max: 16000,
    daysPerSquareMeterMin: 0.2,
    daysPerSquareMeterMax: 0.36
  },
  "Комплексный ремонт": {
    min: 16000,
    max: 28000,
    daysPerSquareMeterMin: 0.35,
    daysPerSquareMeterMax: 0.58
  },
  "Ванная / санузел / плитка": {
    min: 22000,
    max: 38000,
    daysPerSquareMeterMin: 0.75,
    daysPerSquareMeterMax: 1.25
  },
  "Электрика": {
    min: 2500,
    max: 5500,
    daysPerSquareMeterMin: 0.08,
    daysPerSquareMeterMax: 0.18
  },
  "Строительство": {
    min: 35000,
    max: 65000,
    daysPerSquareMeterMin: 0.8,
    daysPerSquareMeterMax: 1.45
  }
};

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

export function formatEstimateRange(estimate: EstimateResult) {
  return `${formatRub(estimate.totalMin)} - ${formatRub(estimate.totalMax)}`;
}

export function formatRateRange(estimate: EstimateResult) {
  return `${formatRub(estimate.rateMin)} - ${formatRub(estimate.rateMax)} за м²`;
}

export function formatDurationRange(estimate: EstimateResult) {
  return `${estimate.durationMin}-${estimate.durationMax} рабочих дней`;
}

export function calculateEstimate(input: EstimateInput, calculatedAt = new Date().toISOString()) {
  const area = parseEstimateArea(input.area);
  const rate = ESTIMATE_RATE_TABLE[input.repairType];

  if (!area || !rate) {
    return null;
  }

  const totalMin = Math.round(area * rate.min);
  const totalMax = Math.round(area * rate.max);
  const durationMin = Math.max(3, Math.ceil(area * rate.daysPerSquareMeterMin));
  const durationMax = Math.max(durationMin + 2, Math.ceil(area * rate.daysPerSquareMeterMax));

  return {
    objectType: input.objectType,
    area,
    city: input.city,
    repairType: input.repairType,
    rateMin: rate.min,
    rateMax: rate.max,
    totalMin,
    totalMax,
    durationMin,
    durationMax,
    calculatedAt,
    disclaimer: ESTIMATE_DISCLAIMER,
    rateNote: ESTIMATE_RATE_TODO
  } satisfies EstimateResult;
}
