'use strict';

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

function resolvePath(filename) {
  const name = filename.endsWith('.json') ? filename : `${filename}.json`;
  return path.join(DATA_DIR, name);
}

async function readJson(filename) {
  const filePath = resolvePath(filename);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error(`Data file "${filename}" must contain a JSON array.`);
    }

    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeJson(filename, []);
      return [];
    }
    throw err;
  }
}

async function writeJson(filename, data) {
  if (!Array.isArray(data)) {
    throw new TypeError(
      `writeJson: data must be an array (got ${typeof data})`,
    );
  }

  const filePath = resolvePath(filename);
  const tmpPath = `${filePath}.tmp`;
  const serialised = JSON.stringify(data, null, 2);

  await fs.writeFile(tmpPath, serialised, 'utf8');
  await fs.rename(tmpPath, filePath);
}

module.exports = { readJson, writeJson };
