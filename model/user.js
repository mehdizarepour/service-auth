const { castArray, pick } = require('lodash');

const { memory: db } = require('~/config/app');
const { uniqueId } = require('~/lib/crypto');

const MODEL_NAME = 'users';

/**
 * Create new user
 * @param {Object} data User
 * @returns {Object}
 */
exports.create = data => {
  const users = castArray(db[MODEL_NAME]);
  const key = uniqueId();

  users.push({ key, ...data });
  db[MODEL_NAME] = users;

  return { ...data, key };
};

/**
 * Update user by key
 * @param {String} key User key
 * @param {Object} data User data
 * @returns {Boolean}
 */
exports.update = (key, data) => {
  let users = castArray(db[MODEL_NAME]);

  users = users.map(i => i.key === key ? data : i);
  db[MODEL_NAME] = users;

  return !!users.find(i => i.key === key);
};

/**
 * Delete user by key
 * @param {String} key User key
 * @returns {Boolean}
 */
exports.delete = key => {
  let users = castArray(db[MODEL_NAME]);

  users = users.filter(i => i.key !== key);
  db[MODEL_NAME] = users;

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
 * Get user by phoneNumber
 * @param {String} phoneNumber User phone number
 * @param {Array} properties User properties
 * @returns {Object}
 */
exports.getUserByPhoneNumber = (phoneNumber, properties) => {
  const res = db[MODEL_NAME].find(i => i.phoneNumber === phoneNumber);

  return res ? pick(res, properties) : null;
};
