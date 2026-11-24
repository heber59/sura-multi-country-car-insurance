import { Market } from '../../../core/market/market.types';

export function formatQuotePrice(price: number, market: Market): string {
  return new Intl.NumberFormat(market.locale, {
    style: 'currency',
    currency: market.currency,
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(price);
}
