const mongodb = require('mongodb');
const Redis = require('ioredis');

const appConfig = require('~/config/app');

// Connection URL
const url = 'mongodb://mongodb:27017/authdb';

let database;

exports.db = {
  collection: async name => {
    if (database) {
      return database.collection(name);
    }

    const client = await mongodb.MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    database = client.db('authdb');

    return database.collection(name);
  },

  fieldProjector: fields => fields.reduce((acc, value) => {
    acc[[value]] = 1;

    return acc;
  }, {}),

  ObjectID: mongodb.ObjectID
};

exports.redis = new Redis(appConfig.redis);
