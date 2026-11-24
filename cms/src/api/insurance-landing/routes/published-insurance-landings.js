'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/insurance-landings',
      handler: 'insurance-landing.findPublished',
      config: { auth: false },
    },
  ],
};
