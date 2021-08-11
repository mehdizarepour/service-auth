const { v4: uuid } = require('uuid');
const db = require('~/lib/db');

const MODEL_NAME = 'users';

/**
 * Create new user
 * @param {Object} data User
 * @returns {Object}
 */
exports.create = data => {
  const collection = await db.collection(MODEL_NAME);

  return collection.insertOne({ ...data, key: uuid() });
};

/**
 * Update user
 * @param {Object} condition
 * @param {Object} data User data
 * @returns {Boolean}
 */
exports.update = async (condition, data) => {
  const collection = await db.collection(MODEL_NAME);

  const res = await collection.updateOne(condition, { $set: data });

  return !!res.modifiedCount;
};

/**
 * Delete user
 * @param {String} key User key
 * @returns {Boolean}
 */
exports.delete = key => {
  const collection = await db.collection(MODEL_NAME);

  const res = await collection.deleteOne({ key })

  return !!res.deletedCount;
};

/**
 * Get user by key
 * @param {String} key User key
 * @param {Array}  properties User properties
 * @returns {Object}
 */
exports.getByKey = (key, properties) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.findOne({ key })
    .project(db.fieldProjector(properties))
    .next();
};

/**
 * Get user by phoneNumber
 * @param {String} phoneNumber User phone number
 * @param {Array} properties User properties
 * @returns {Object}
 */
exports.getUserByPhoneNumber = (phoneNumber, properties) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.findOne({ phoneNumber })
    .project(db.fieldProjector(properties))
    .next();
};
