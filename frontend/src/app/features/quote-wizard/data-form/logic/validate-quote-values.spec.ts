import { describe, expect, it } from 'vitest';
import { markets } from '../../../../core/market/market.config';
import { QuoteValues } from '../types/quote-field';
import { mapQuoteFields } from './map-quote-fields';
import { areQuoteValuesValid, getInvalidQuoteFields } from './validate-quote-values';

const fieldDefaults = {
  section: 'policyholder',
  label: 'Datos de prueba',
  required: true,
  helpText: 'Usa datos ficticios.',
  errorMessage: 'Revisa el valor ingresado.',
};

const birthDate = {
  ...fieldDefaults, key: 'birthDate', type: 'date', validation: { minimumAge: 18 },
};
const vehicleType = {
  ...fieldDefaults, key: 'vehicleType', type: 'select', section: 'vehicle',
  options: [{ value: 'suv', label: 'SUV' }, { value: 'sedan', label: 'Sedán' }],
};
const year = {
  ...fieldDefaults, key: 'year', type: 'number', section: 'vehicle', validation: { vehicleYear: true },
};
const documentNumber = {
  ...fieldDefaults, key: 'documentNumber', type: 'text', sensitive: true,
  validation: { pattern: '\\d{8}' },
};
const fictitiousDetails = {
  ...fieldDefaults, key: 'fictitiousDetails', type: 'checkbox',
};

const fieldConfiguration = [birthDate, vehicleType, year, documentNumber, fictitiousDetails];
const fields = mapQuoteFields(fieldConfiguration) ?? [];
const validValues = {
  birthDate: '2008-11-23',
  vehicleType: 'suv',
  year: 2026,
  documentNumber: '12345678',
  fictitiousDetails: true,
};
const today = new Date('2026-11-23T12:00:00Z');

describe('mapQuoteFields', () => {
  it('preserves the published field order and vehicle type options', () => {
    expect(fields.map(({ key }) => key)).toEqual(fieldConfiguration.map(({ key }) => key));
    expect(fields[1].options).toEqual(vehicleType.options);
    expect(fields[3].sensitive).toBe(true);
  });

  it.each([
    { configuration: [] },
    { configuration: [birthDate, birthDate] },
    { configuration: [{ ...year, validation: { vehicleYear: 'true' } }] },
    { configuration: [{ ...birthDate, validation: { minimumAge: -1 } }] },
    { configuration: [{ ...vehicleType, options: [] }] },
    { configuration: [{ ...vehicleType, options: [vehicleType.options[0], vehicleType.options[0]] }] },
    { configuration: [{ ...documentNumber, validation: { pattern: '[' } }] },
  ])('rejects malformed field configuration %#', ({ configuration }) => {
    expect(mapQuoteFields(configuration)).toBeNull();
  });
});

describe('quote field validation', () => {
  it.each(['cl', 'co'] as const)('accepts an adult on their eighteenth birthday in %s', (code) => {
    expect(areQuoteValuesValid(fields, validValues, markets[code], today)).toBe(true);
  });

  it.each([
    ['birthDate', '2008-11-24'],
    ['birthDate', '2000-02-30'],
    ['vehicleType', 'truck'],
    ['year', 2005],
    ['year', 2028],
    ['year', 2026.5],
    ['year', '2026'],
    ['documentNumber', 'X12345678'],
    ['fictitiousDetails', false],
  ])('rejects %s with invalid value %s', (key, value) => {
    const values: QuoteValues = { ...validValues, [key]: value };
    expect(getInvalidQuoteFields(fields, values, markets.cl, today).map((field) => field.key)).toEqual([key]);
  });

  it.each([2006, 2027])('accepts the inclusive vehicle year limit %s', (vehicleYear) => {
    expect(areQuoteValuesValid(fields, { ...validValues, year: vehicleYear }, markets.co, today)).toBe(true);
  });

  it('uses each market calendar around midnight', () => {
    const midnightInChile = new Date('2026-11-23T03:30:00Z');
    expect(areQuoteValuesValid(fields, validValues, markets.cl, midnightInChile)).toBe(true);
    expect(areQuoteValuesValid(fields, validValues, markets.co, midnightInChile)).toBe(false);
  });

  it('validates a newly published field without a frontend change', () => {
    const nextConfig = mapQuoteFields([...fieldConfiguration, { ...year, key: 'additionalVehicleYear' }]) ?? [];
    expect(getInvalidQuoteFields(nextConfig, validValues, markets.co, today).map(({ key }) => key))
      .toEqual(['additionalVehicleYear']);
  });
});
