import { describe, expect, it } from 'vitest';
import { mapQuoteConfiguration } from './map-quote-configuration';

const entry = {
  market: 'cl',
  publishedAt: '2026-11-23T00:00:00.000Z',
  fields: [{
    key: 'plate', section: 'vehicle', type: 'text', label: 'Patente',
    required: true, helpText: '', errorMessage: 'Ingresa la patente.',
  }],
  plans: [{
    key: 'basic', name: 'Esencial', description: 'Plan de prueba',
    price: 0, coverages: ['Asistencia'], benefits: ['Grúa'], active: true, recommended: true,
  }],
  terms: 'Términos de prueba',
};

describe('mapQuoteConfiguration', () => {
  it('uses the published plan order and keeps a configured zero price', () => {
    const plans = [
      entry.plans[0],
      { ...entry.plans[0], key: 'inactive', active: false },
      { ...entry.plans[0], key: 'complete', price: 10000 },
    ];
    const configuration = mapQuoteConfiguration({ data: [{ ...entry, plans }] }, 'cl');

    expect(configuration?.plans.map(({ key }) => key)).toEqual(['basic', 'complete']);
    expect(configuration?.plans[0].price).toBe(0);
  });

  it('keeps the form usable when plans and terms are unavailable', () => {
    const configuration = mapQuoteConfiguration({ data: [{ ...entry, plans: [], terms: null }] }, 'cl');

    expect(configuration?.fields[0].key).toBe('plate');
    expect(configuration?.plans).toEqual([]);
    expect(configuration?.terms).toBeNull();
  });

  it('rejects cross-market, noncanonical and ambiguous entries', () => {
    expect(mapQuoteConfiguration({ data: [entry] }, 'co')).toBeNull();
    expect(mapQuoteConfiguration({ data: [{ ...entry, publishedAt: '0' }] }, 'cl')).toBeNull();
    expect(mapQuoteConfiguration({ data: [entry, entry] }, 'cl')).toBeNull();
  });
});
