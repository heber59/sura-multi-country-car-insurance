'use strict';

const { randomBytes } = require('node:crypto');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

function generateSecret() {
  return randomBytes(32).toString('hex');
}

const environment = [
  'HOST=127.0.0.1',
  'PORT=1337',
  'APP_KEYS=' + Array.from({ length: 4 }, generateSecret).join(','),
  'ADMIN_JWT_SECRET=' + generateSecret(),
  'API_TOKEN_SALT=' + generateSecret(),
  'TRANSFER_TOKEN_SALT=' + generateSecret(),
  'ENCRYPTION_KEY=' + generateSecret(),
  'STRAPI_TELEMETRY_DISABLED=true',
];

try {
  writeFileSync(resolve(__dirname, '..', '.env'), environment.join('\n') + '\n', {
    flag: 'wx',
    mode: 0o600,
  });
} catch (error) {
  if (error.code !== 'EEXIST') {
    throw error;
  }
}
