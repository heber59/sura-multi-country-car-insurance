'use strict';

module.exports = ({ env }) => ({
  seedDevelopmentContent: env('NODE_ENV') === 'development' &&
    env.bool('SEED_INSURANCE_LANDINGS', true),
});
