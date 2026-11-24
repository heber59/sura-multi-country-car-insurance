'use strict';

const { readFileSync } = require('node:fs');
const { isIPv6 } = require('node:net');
const { resolve } = require('node:path');
const { parseEnv } = require('node:util');

function readCmsEnvironment() {
  const envPath = resolve(__dirname, '..', 'cms', process.env.ENV_PATH || '.env');
  try {
    return parseEnv(readFileSync(envPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return {};
  }
}

function formatProxyHost(bindHost) {
  if (bindHost === '0.0.0.0') {
    return '127.0.0.1';
  }
  if (bindHost === '::') {
    return '[::1]';
  }
  return isIPv6(bindHost) ? `[${bindHost}]` : bindHost;
}

const cmsEnvironment = readCmsEnvironment();
const host = formatProxyHost(process.env.HOST ?? cmsEnvironment.HOST ?? '127.0.0.1');
const port = Number.parseInt(process.env.PORT ?? cmsEnvironment.PORT ?? '1337', 10);

module.exports = {
  '/api/insurance-landings': { target: `http://${host}:${port}` },
  '/api/quote-configurations': { target: `http://${host}:${port}` },
};
