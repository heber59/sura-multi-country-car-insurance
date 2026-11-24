import { MarketCode } from '../../core/market/market.types';
import { QuoteValues } from './data-form/types/quote-field';

export interface QuoteDraft {
  readonly values: QuoteValues;
  readonly planKey: string | null;
  readonly reference: string | null;
}

const emptyDraft: QuoteDraft = { values: {}, planKey: null, reference: null };

function storageKey(market: MarketCode): string {
  return `sura-quote-v1-${market}`;
}

export function readQuoteDraft(market: MarketCode): QuoteDraft {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(storageKey(market)) ?? 'null');
    if (typeof stored !== 'object' || !stored || !('values' in stored) ||
      typeof stored.values !== 'object' || !stored.values || Array.isArray(stored.values)) {
      return emptyDraft;
    }

    const values = Object.fromEntries(Object.entries(stored.values).filter(([, value]) =>
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
    )) as QuoteValues;
    const planKey = 'planKey' in stored ? stored.planKey : null;
    const reference = 'reference' in stored ? stored.reference : null;

    return {
      values,
      planKey: typeof planKey === 'string' ? planKey : null,
      reference: typeof reference === 'string' && /^[A-Z]{2}-[0-9A-F]{12}$/.test(reference) &&
        reference.startsWith(market.toUpperCase())
        ? reference
        : null,
    };
  } catch {
    return emptyDraft;
  }
}

export function saveQuoteDraft(market: MarketCode, draft: QuoteDraft): void {
  try {
    sessionStorage.setItem(storageKey(market), JSON.stringify(draft));
  } catch {
    // The current quote remains usable when browser storage is unavailable.
  }
}
