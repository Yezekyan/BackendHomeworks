'use strict';

const { randomBytes } = require('crypto');

const BYTES = 4;

function generateId(prefix) {
  if (!prefix || typeof prefix !== 'string') {
    throw new TypeError('generateId: prefix must be a non-empty string');
  }
  const hex = randomBytes(BYTES).toString('hex');
  return `${prefix}_${hex}`;
}

module.exports = { generateId };
