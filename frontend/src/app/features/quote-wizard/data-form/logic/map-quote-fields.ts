import { QuoteField, QuoteFieldOption, QuoteFieldType, QuoteFieldValidation } from '../types/quote-field';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonblank(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function mapOptions(value: unknown, type: QuoteFieldType): QuoteFieldOption[] | null {
  if (value === undefined && type !== 'select') {
    return [];
  }

  if (!Array.isArray(value) || (type === 'select' && value.length === 0)) {
    return null;
  }

  const options: QuoteFieldOption[] = [];
  const values = new Set<string>();
  for (const option of value) {
    if (!isRecord(option) || !isNonblank(option['value']) || !isNonblank(option['label'])) {
      return null;
    }

    const optionValue = option['value'].trim();
    if (values.has(optionValue)) {
      return null;
    }

    values.add(optionValue);
    options.push({ value: optionValue, label: option['label'].trim() });
  }

  return options;
}

function mapValidation(value: unknown, type: QuoteFieldType): QuoteFieldValidation | null {
  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    return null;
  }

  const { pattern, minimumAge, vehicleYear, min, max } = value;
  if (
    (pattern !== undefined && (type !== 'text' || !isNonblank(pattern))) ||
    (minimumAge !== undefined &&
      (type !== 'date' || !isFiniteNumber(minimumAge) || !Number.isInteger(minimumAge) || minimumAge < 0)) ||
    (vehicleYear !== undefined && (type !== 'number' || typeof vehicleYear !== 'boolean')) ||
    (min !== undefined && (type !== 'number' || !isFiniteNumber(min))) ||
    (max !== undefined && (type !== 'number' || !isFiniteNumber(max))) ||
    (min !== undefined && max !== undefined && min > max)
  ) {
    return null;
  }

  try {
    return {
      pattern: pattern === undefined ? undefined : new RegExp('^(?:' + pattern + ')$', 'u'),
      minimumAge, vehicleYear, min, max,
    };
  } catch {
    return null;
  }
}

function mapField(value: unknown): QuoteField | null {
  if (!isRecord(value)) {
    return null;
  }

  const { key, section, type, label, required, helpText, errorMessage, sensitive } = value;
  if (
    typeof key !== 'string' || !/^[a-zA-Z][\w-]*$/.test(key) ||
    (section !== 'policyholder' && section !== 'vehicle') ||
    (type !== 'text' && type !== 'number' && type !== 'select' && type !== 'date' && type !== 'checkbox') ||
    !isNonblank(label) || typeof required !== 'boolean' || typeof helpText !== 'string' ||
    !isNonblank(errorMessage) || (sensitive !== undefined && typeof sensitive !== 'boolean')
  ) {
    return null;
  }

  const options = mapOptions(value['options'], type);
  const validation = mapValidation(value['validation'], type);
  if (!options || !validation) {
    return null;
  }

  return {
    key, section, type, required, options, validation,
    label: label.trim(),
    helpText: helpText.trim(),
    errorMessage: errorMessage.trim(),
    sensitive: sensitive ?? false,
  };
}

export function mapQuoteFields(value: unknown): QuoteField[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const fields: QuoteField[] = [];
  const keys = new Set<string>();
  for (const entry of value) {
    const field = mapField(entry);
    if (!field || keys.has(field.key)) {
      return null;
    }

    keys.add(field.key);
    fields.push(field);
  }

  return fields;
}
