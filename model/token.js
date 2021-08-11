const { v4: uuid } = require('uuid');
const db = require('~/lib/db');

const MODEL_NAME = 'tokens';

/**
 * Create new token
 * @param {Object} data Token
 * @returns {Object}
 */
exports.create = data => {
  const collection = await db.collection(MODEL_NAME);

  return collection.insertOne({ ...data, key: uuid() });
};

/**
 * Update token
 * @param {String} condition
 * @param {Object} data Token data
 * @returns {Boolean}
 */
exports.update = (condition, data) => {
  const collection = await db.collection(MODEL_NAME);

  const res = await collection.updateOne(condition, { $set: data });

  return !!res.modifiedCount;
};

/**
 * Delete token by key
 * @param {String} key Token key
 * @returns {Boolean}
 */
exports.delete = key => {
  const collection = await db.collection(MODEL_NAME);

  const res = await collection.deleteOne({ key })

  return !!res.deletedCount;
};

/**
 * Get token by key
 * @param {String} key Token key
 * @param {Array}  properties Token properties
 * @returns {Object}
 */
exports.getByKey = (key, properties) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.findOne({ key })
    .project(db.fieldProjector(properties))
    .next();
};

/**
 * Check auth refresh token
 * @param {String} userKey
 * @param {String} authRefreshToken
 * @returns {Promise<Boolean>}
 */
exports.checkAuthRefreshToken = async (userKey, authRefreshToken) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.findOne({ userKey, authRefreshToken })
    .hasNext();
};

/**
 * Check auth token
 * @param {String} userKey
 * @param {String} authJwtid
 * @returns {Boolean}
 */
exports.checkAuthToken = async (userKey, authJwtid) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.findOne({ userKey, authJwtid })
    .hasNext();
};
