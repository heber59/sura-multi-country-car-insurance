import { Market, MarketCode } from './market.types';

export type { Market, MarketCode } from './market.types';

export const markets: Readonly<Record<MarketCode, Market>> = {
  cl: { code: 'cl', name: 'Chile', locale: 'es-CL', currency: 'CLP' },
  co: { code: 'co', name: 'Colombia', locale: 'es-CO', currency: 'COP' },
};
