const { castArray, pick } = require('lodash');

const { memory: db } = require('~/config/app');
const { uniqueId } = require('~/lib/crypto');

const MODEL_NAME = 'tokens';

/**
 * Create new token
 * @param {Object} data Token
 * @returns {Object}
 */
exports.create = data => {
  const tokens = castArray(db[MODEL_NAME]);

  tokens.push({ key: uniqueId(), ...data });
  db[MODEL_NAME] = tokens;

  return data;
};

/**
 * Update token by key
 * @param {String} key Token key
 * @param {Object} data Token data
 * @returns {Boolean}
 */
exports.update = (key, data) => {
  let tokens = castArray(db[MODEL_NAME]);

  tokens = tokens.map(i => i.key === key ? data : i);
  db[MODEL_NAME] = tokens;

  return !!tokens.find(i => i.key === key);
};

/**
 * Delete token by key
 * @param {String} key Token key
 * @returns {Boolean}
 */
exports.delete = key => {
  let tokens = castArray(db[MODEL_NAME]);

  tokens = tokens.filter(i => i.key !== key);
  db[MODEL_NAME] = tokens;

  return true;
};

/**
 * Get user by key
 * @param {String} key User key
 * @param {Array}  properties User properties
 * @returns {Object}
 */
exports.getByKey = (key, properties) => {
  const res = db[MODEL_NAME].find(i => i.key === key);

  return res ? pick(res, properties) : null;
};

/**
 * Check auth refresh token
 * @param {String} userKey
 * @param {String} authRefreshToken
 * @returns {Promise<Boolean>}
 */
exports.checkAuthRefreshToken = async (userKey, authRefreshToken) =>
  !!db[MODEL_NAME].find(i => i.userKey === userKey || i.authRefreshToken === authRefreshToken);
