'use strict';

const AppError = require('../utils/AppError');
const VALID_STATUSES = ['to-read', 'reading', 'finished'];
const VALID_FREQS = ['daily', 'weekly', 'monthly'];

const schemas = {
  register: {
    username: (v, e) => {
      if (typeof v !== 'string' || v.trim().length < 3 || v.trim().length > 30)
        e.push('username must be a string between 3 and 30 characters');
    },
    password: (v, e) => {
      if (typeof v !== 'string' || v.length < 6)
        e.push('password must be at least 6 characters');
    },
  },

  login: {
    username: (v, e) => {
      if (typeof v !== 'string' || v.trim().length === 0)
        e.push('username is required');
    },
    password: (v, e) => {
      if (typeof v !== 'string' || v.length === 0)
        e.push('password is required');
    },
  },

  createNote: {
    title: (v, e) => {
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 100)
        e.push('title must be a string between 1 and 100 characters');
    },
    body: (v, e) => {
      if (
        typeof v !== 'string' ||
        v.trim().length < 1 ||
        v.trim().length > 2000
      )
        e.push('body must be a string up to 2000 characters');
    },
    tags: (v, e) => {
      if (v === undefined) return;
      if (!Array.isArray(v)) {
        e.push('tags must be an array');
        return;
      }
      for (const tag of v) {
        if (
          typeof tag !== 'string' ||
          tag.trim().length < 1 ||
          tag.trim().length > 20
        )
          e.push('each tag must be a string between 1 and 20 characters');
      }
    },
  },

  updateNote: {
    title: (v, e) => {
      if (v === undefined) return;
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 100)
        e.push('title must be a string between 1 and 100 characters');
    },
    body: (v, e) => {
      if (v === undefined) return;
      if (
        typeof v !== 'string' ||
        v.trim().length < 1 ||
        v.trim().length > 2000
      )
        e.push('body must be a string up to 2000 characters');
    },
    tags: (v, e) => {
      if (v === undefined) return;
      if (!Array.isArray(v)) {
        e.push('tags must be an array');
        return;
      }
      for (const tag of v) {
        if (
          typeof tag !== 'string' ||
          tag.trim().length < 1 ||
          tag.trim().length > 20
        )
          e.push('each tag must be a string between 1 and 20 characters');
      }
    },
  },

  createBook: {
    title: (v, e) => {
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 200)
        e.push('title must be a string between 1 and 200 characters');
    },
    author: (v, e) => {
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 100)
        e.push('author must be a string between 1 and 100 characters');
    },
    status: (v, e) => {
      if (v === undefined) return;
      if (!VALID_STATUSES.includes(v))
        e.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    },
    rating: (v, e) => {
      if (v === undefined || v === null) return;
      if (!Number.isInteger(v) || v < 1 || v > 5)
        e.push('rating must be an integer between 1 and 5');
    },
  },

  updateBook: {
    title: (v, e) => {
      if (v === undefined) return;
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 200)
        e.push('title must be a string between 1 and 200 characters');
    },
    author: (v, e) => {
      if (v === undefined) return;
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 100)
        e.push('author must be a string between 1 and 100 characters');
    },
    status: (v, e) => {
      if (v === undefined) return;
      if (!VALID_STATUSES.includes(v))
        e.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    },
    rating: (v, e) => {
      if (v === undefined || v === null) return;
      if (!Number.isInteger(v) || v < 1 || v > 5)
        e.push('rating must be an integer between 1 and 5');
    },
  },

  createHabit: {
    name: (v, e) => {
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 60)
        e.push('name must be a string between 1 and 60 characters');
    },
    frequency: (v, e) => {
      if (!VALID_FREQS.includes(v))
        e.push(`frequency must be one of: ${VALID_FREQS.join(', ')}`);
    },
  },

  updateHabit: {
    name: (v, e) => {
      if (v === undefined) return;
      if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 60)
        e.push('name must be a string between 1 and 60 characters');
    },
    frequency: (v, e) => {
      if (v === undefined) return;
      if (!VALID_FREQS.includes(v))
        e.push(`frequency must be one of: ${VALID_FREQS.join(', ')}`);
    },
  },
};

function validate(schemaName) {
  const schema = schemas[schemaName];

  if (!schema) {
    throw new Error(`validate(): unknown schema "${schemaName}"`);
  }

  return (req, res, next) => {
    const errors = [];

    for (const [field, checker] of Object.entries(schema)) {
      checker(req.body[field], errors);
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join('; '), 400));
    }

    next();
  };
}

module.exports = validate;
