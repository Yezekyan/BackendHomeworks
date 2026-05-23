'use strict';

const fs = require('fs');
const path = require('path');
const { IS_PRODUCTION } = require('../config/env');
const LOG_PATH = path.resolve(__dirname, '..', '..', 'data', 'access.log');
let logStream = null;

if (IS_PRODUCTION) {
  logStream = fs.createWriteStream(LOG_PATH, { flags: 'a' });
}

const colours = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

function colorStatus(status) {
  if (status < 300) return `${colours.green}${status}${colours.reset}`;
  if (status < 400) return `${colours.cyan}${status}${colours.reset}`;
  if (status < 500) return `${colours.yellow}${status}${colours.reset}`;
  return `${colours.red}${status}${colours.reset}`;
}

function loggerMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') return next();

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const line = `${new Date().toISOString()} ${req.method} ${req.originalUrl} → ${res.statusCode} (${durationMs.toFixed(1)}ms)`;

    if (IS_PRODUCTION && logStream) {
      logStream.write(line + '\n');
    } else {
      console.log(
        `${colours.dim}${new Date().toISOString()}${colours.reset} ` +
          `${req.method} ${req.originalUrl} → ` +
          `${colorStatus(res.statusCode)} ` +
          `${colours.dim}${durationMs.toFixed(1)}ms${colours.reset}`,
      );
    }
  });

  next();
}

module.exports = loggerMiddleware;
