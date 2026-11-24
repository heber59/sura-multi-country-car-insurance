export type MarketCode = 'cl' | 'co';

export interface Market {
  readonly code: MarketCode;
  readonly name: string;
  readonly locale: 'es-CL' | 'es-CO';
  readonly currency: 'CLP' | 'COP';
}
