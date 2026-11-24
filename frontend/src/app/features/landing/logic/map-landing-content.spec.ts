import { describe, expect, it } from 'vitest';
import { mapLandingContent } from './map-landing-content';

const publishedEntry = {
  market: 'cl',
  headline: '  Seguro de auto  ',
  description: '  Conoce las opciones para tu vehículo.  ',
  publishedAt: '2026-11-21T13:00:00.000Z',
};

describe('mapLandingContent', () => {
  it.each(['cl', 'co'] as const)('maps published content for %s', (market) => {
    expect(mapLandingContent({ data: [{ ...publishedEntry, market }] }, market)).toEqual({
      headline: 'Seguro de auto',
      description: 'Conoce las opciones para tu vehículo.',
    });
  });

  it('rejects a published entry from the other market', () => {
    expect(mapLandingContent({ data: [publishedEntry] }, 'co')).toBeNull();
  });

  it.each([
    { ...publishedEntry, publishedAt: null },
    { ...publishedEntry, publishedAt: 'invalid' },
    { ...publishedEntry, publishedAt: '0' },
    { ...publishedEntry, publishedAt: '2026-11-21' },
    { ...publishedEntry, publishedAt: '2026-02-30T13:00:00.000Z' },
    { ...publishedEntry, headline: ' ' },
    { ...publishedEntry, description: 7 },
  ])('rejects an unpublished or malformed entry', (entry) => {
    expect(mapLandingContent({ data: [entry] }, 'cl')).toBeNull();
  });

  it.each([
    null,
    { data: {} },
    { data: [] },
    { data: [publishedEntry, publishedEntry] },
  ])('rejects missing or ambiguous content', (response) => {
    expect(mapLandingContent(response, 'cl')).toBeNull();
  });
});
