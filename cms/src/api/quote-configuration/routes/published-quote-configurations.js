'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/quote-configurations',
      handler: 'quote-configuration.findPublished',
      config: { auth: false },
    },
  ],
};
