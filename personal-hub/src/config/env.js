'use strict';

require('dotenv').config();

const REQUIRED = ['JWT_SECRET'];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[config] Missing required environment variables: ${missing.join(', ')}`,
  );
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('[config] JWT_SECRET must be at least 32 characters long');
  process.exit(1);
}

module.exports = Object.freeze({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',

  COOKIE_NAME: process.env.COOKIE_NAME ?? 'hub_token',
  COOKIE_MAX_AGE_MS: parseInt(process.env.COOKIE_MAX_AGE_MS ?? '86400000', 10),
});
