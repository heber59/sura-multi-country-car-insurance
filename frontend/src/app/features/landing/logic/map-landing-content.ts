import { MarketCode } from '../../../core/market/market.config';
import { isPublicationTimestamp } from '../../../core/strapi/is-publication-timestamp';
import { LandingContent } from '../types/landing-content';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mapLandingContent(response: unknown, market: MarketCode): LandingContent | null {
  if (!isRecord(response) || !Array.isArray(response['data']) || response['data'].length !== 1) {
    return null;
  }

  const [record] = response['data'];
  if (!isRecord(record) || record['market'] !== market) {
    return null;
  }

  const { headline, description, publishedAt } = record;
  if (
    typeof headline !== 'string' || !headline.trim() ||
    typeof description !== 'string' || !description.trim() ||
    !isPublicationTimestamp(publishedAt)
  ) {
    return null;
  }

  return { headline: headline.trim(), description: description.trim() };
}
