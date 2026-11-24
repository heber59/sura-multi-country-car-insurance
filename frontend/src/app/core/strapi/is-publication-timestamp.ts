export function isPublicationTimestamp(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  // Strapi emits a UTC ISO timestamp with milliseconds.
  const timestamp = new Date(value);
  return Number.isFinite(timestamp.getTime()) && timestamp.toISOString() === value;
}
