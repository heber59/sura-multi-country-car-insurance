import { Market, MarketCode } from '../../../../core/market/market.config';
import { QuoteField, QuoteValue, QuoteValues } from '../types/quote-field';

const marketTimeZones: Readonly<Record<MarketCode, string>> = {
  cl: 'America/Santiago',
  co: 'America/Bogota',
};

function marketDate(market: Market, now: Date): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: marketTimeZones[market.code],
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const year = parts.find(({ type }) => type === 'year')?.value;
  const month = parts.find(({ type }) => type === 'month')?.value;
  const day = parts.find(({ type }) => type === 'day')?.value;
  return [year, month, day].join('-');
}

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) {
    return false;
  }

  const timestamp = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(timestamp.getTime()) && timestamp.toISOString().slice(0, 10) === value;
}

function hasMinimumAge(birthDate: string, today: string, minimumAge: number): boolean {
  const yearDifference = Number(today.slice(0, 4)) - Number(birthDate.slice(0, 4));
  const hadBirthday = today.slice(5) >= birthDate.slice(5);
  return birthDate <= today && yearDifference - (hadBirthday ? 0 : 1) >= minimumAge;
}

function isValid(field: QuoteField, value: QuoteValue | undefined, today: string): boolean {
  if (value === undefined || (typeof value === 'string' && !value.trim())) {
    return !field.required;
  }

  const { pattern, minimumAge, vehicleYear, min, max } = field.validation;
  switch (field.type) {
    case 'text':
      return typeof value === 'string' && (pattern?.test(value.trim()) ?? true);
    case 'number': {
      const currentYear = Number(today.slice(0, 4));
      return typeof value === 'number' && Number.isFinite(value) &&
        (min === undefined || value >= min) &&
        (max === undefined || value <= max) &&
        (!vehicleYear || (Number.isInteger(value) && value >= currentYear - 20 && value <= currentYear + 1));
    }
    case 'date':
      return typeof value === 'string' && isValidCalendarDate(value) &&
        (minimumAge === undefined || hasMinimumAge(value, today, minimumAge));
    case 'checkbox':
      return typeof value === 'boolean' && (!field.required || value);
    case 'select':
      return field.options.some((option) => option.value === value);
  }
}

export function getQuoteValue(values: QuoteValues, key: string): QuoteValue | undefined {
  return Object.hasOwn(values, key) ? values[key] : undefined;
}

export function getInvalidQuoteFields(
  fields: readonly QuoteField[],
  values: QuoteValues,
  market: Market,
  now = new Date(),
): QuoteField[] {
  const today = marketDate(market, now);
  return fields.filter((field) => !isValid(field, getQuoteValue(values, field.key), today));
}

export function areQuoteValuesValid(
  fields: readonly QuoteField[],
  values: QuoteValues,
  market: Market,
  now = new Date(),
): boolean {
  return fields.length > 0 && getInvalidQuoteFields(fields, values, market, now).length === 0;
}
