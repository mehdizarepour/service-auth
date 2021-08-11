const { v4: uuid } = require('uuid');
const { db } = require('~/lib/db');

const MODEL_NAME = 'users';

/**
 * Create new user
 * @param {Object} data User
 * @returns {Object}
 */
exports.create = async data => {
  const collection = await db.collection(MODEL_NAME);
  const key = uuid();

  const { insertedId: id } = await collection.insertOne({ ...data, key });

  return { id, key, ...data };
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
exports.delete = async key => {
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
exports.getByKey = async (key, properties) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.find({ key })
    .project(db.fieldProjector(properties))
    .next();
};

/**
 * Get user by phoneNumber
 * @param {String} phoneNumber User phone number
 * @param {Array} properties User properties
 * @returns {Object}
 */
exports.getUserByPhoneNumber = async (phoneNumber, properties) => {
  const collection = await db.collection(MODEL_NAME);

  return collection.find({ phoneNumber })
    .project(db.fieldProjector(properties))
    .next();
};
