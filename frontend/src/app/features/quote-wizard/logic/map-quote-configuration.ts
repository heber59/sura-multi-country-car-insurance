import { MarketCode } from '../../../core/market/market.types';
import { isPublicationTimestamp } from '../../../core/strapi/is-publication-timestamp';
import { mapQuoteFields } from '../data-form/logic/map-quote-fields';
import { QuoteConfiguration, QuotePlan } from '../types/quote-configuration';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isTextList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isText);
}

function mapPlans(entries: unknown): QuotePlan[] | null {
  if (!Array.isArray(entries)) {
    return null;
  }

  const plans = new Map<string, QuotePlan>();
  for (const entry of entries) {
    if (!isRecord(entry) || typeof entry['active'] !== 'boolean') {
      return null;
    }

    if (!entry['active']) {
      continue;
    }

    const { key, name, description, price, coverages, benefits, recommended } = entry;
    if (
      !isText(key) || !isText(name) || !isText(description) || plans.has(key) ||
      typeof price !== 'number' || !Number.isSafeInteger(price) || price < 0 ||
      !isTextList(coverages) || !isTextList(benefits) || typeof recommended !== 'boolean'
    ) {
      return null;
    }

    plans.set(key, { key, name, description, price, coverages, benefits, recommended });
  }

  return [...plans.values()];
}

export function mapQuoteConfiguration(response: unknown, market: MarketCode): QuoteConfiguration | null {
  if (!isRecord(response) || !Array.isArray(response['data']) || response['data'].length !== 1) {
    return null;
  }

  const [entry] = response['data'];
  if (!isRecord(entry) || entry['market'] !== market) {
    return null;
  }

  const { publishedAt, fields, plans, terms } = entry;
  if (!isPublicationTimestamp(publishedAt)) {
    return null;
  }

  const publishedFields = mapQuoteFields(fields);
  const publishedPlans = mapPlans(plans);
  return publishedFields?.length && publishedPlans
    ? { fields: publishedFields, plans: publishedPlans, terms: isText(terms) ? terms.trim() : null }
    : null;
}
