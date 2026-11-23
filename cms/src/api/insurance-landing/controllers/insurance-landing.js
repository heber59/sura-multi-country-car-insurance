'use strict';

module.exports = ({ strapi }) => ({
  async findPublished(ctx) {
    const market = ctx.query.filters?.market?.$eq;
    if (market !== 'cl' && market !== 'co') {
      return ctx.badRequest('A supported market is required.');
    }

    if (ctx.query.status !== 'published') {
      return ctx.badRequest('Only published content is available.');
    }

    const landings = await strapi.documents('api::insurance-landing.insurance-landing').findMany({
      status: 'published',
      filters: { market },
      fields: ['market', 'headline', 'description', 'publishedAt'],
      limit: 2,
    });

    // A second match lets the client treat duplicate published content as unavailable.
    ctx.body = {
      data: landings.map(({ market, headline, description, publishedAt }) => ({
        market,
        headline,
        description,
        publishedAt,
      })),
    };
  },
});
