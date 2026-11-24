'use strict';

function mapField(field) {
  const { key, section, type, label, required, helpText, errorMessage, options, sensitive } = field;
  const validation = {
    pattern: field.pattern || undefined,
    minimumAge: field.minimumAge ?? undefined,
    vehicleYear: field.vehicleYear === true ? true : undefined,
    min: field.minimum ?? undefined,
    max: field.maximum ?? undefined,
  };

  return {
    key,
    section,
    type,
    label,
    required,
    helpText: helpText ?? '',
    errorMessage,
    options: options.map(({ value, label }) => ({ value, label })),
    validation,
    sensitive: sensitive === true,
  };
}

function splitLines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function mapPlan(plan) {
  const { key, name, description, price, coverages, benefits, active, recommended } = plan;
  return {
    key,
    name,
    description,
    price,
    coverages: splitLines(coverages),
    benefits: splitLines(benefits),
    active,
    recommended,
  };
}

module.exports = ({ strapi }) => ({
  async findPublished(ctx) {
    const market = ctx.query.filters?.market?.$eq;
    if (market !== 'cl' && market !== 'co') {
      return ctx.badRequest('A supported market is required.');
    }

    if (ctx.query.status !== 'published') {
      return ctx.badRequest('Only published content is available.');
    }

    const configurations = await strapi.documents('api::quote-configuration.quote-configuration').findMany({
      status: 'published',
      filters: { market },
      fields: ['market', 'terms', 'publishedAt'],
      populate: { fields: { populate: ['options'] } },
      limit: 2,
    });

    const plans = configurations.length === 1
      ? await strapi.documents('api::quote-plan.quote-plan').findMany({
          status: 'published',
          filters: { market, active: true },
          sort: ['position:asc', 'id:asc'],
          fields: ['key', 'name', 'description', 'price', 'coverages', 'benefits', 'active', 'recommended'],
        })
      : [];

    // A second match lets the client reject duplicate market configurations.
    ctx.body = {
      data: configurations.map(({ market, terms, publishedAt, fields }) => ({
        market,
        terms,
        publishedAt,
        fields: fields.map(mapField),
        plans: plans.map(mapPlan),
      })),
    };
  },
});
