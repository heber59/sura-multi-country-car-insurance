'use strict';

const seedQuoteContent = require('./seed/quote-content');

const initialLandings = [
  {
    market: 'cl',
    headline: 'Seguro automotriz',
    description: 'Conoce cómo cotizar un seguro para tu auto en Chile.',
  },
  {
    market: 'co',
    headline: 'Seguro de autos',
    description: 'Conoce cómo cotizar un seguro para tu carro en Colombia.',
  },
];

module.exports = {
  async bootstrap({ strapi }) {
    await seedQuoteContent(strapi);

    if (!strapi.config.get('landing.seedDevelopmentContent')) {
      return;
    }

    const seedState = strapi.store({ type: 'core', name: 'insurance-landings' });
    const landings = strapi.documents('api::insurance-landing.insurance-landing');

    await strapi.db.transaction(async () => {
      if (await seedState.get({ key: 'initialized' })) {
        return;
      }

      for (const data of initialLandings) {
        const filters = { market: data.market };
        const draft = await landings.findFirst({ status: 'draft', filters });
        const published = await landings.findFirst({ status: 'published', filters });

        if (!draft && !published) {
          await landings.create({ status: 'published', data });
        }
      }

      await seedState.set({ key: 'initialized', value: true });
    });
  },
};
