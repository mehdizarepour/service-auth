const mongodb = require('mongodb');
const Redis = require('ioredis');

const appConfig = require('~/config/app');

// Connection URL
const url = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.database}?authSource=admin`;

let database;

exports.db = {
  collection: async name => {
    if (database) {
      return database.collection(name);
    }

    const client = await mongodb.MongoClient.connect(url, {
      useUnifiedTopology: true, useNewUrlParser: true, authSource: 'admin', auth: {
        username: appConfig.db.username,
        password: appConfig.db.password
      }
    });
    database = client.db(appConfig.db.database);

    return database.collection(name);
  },

  fieldProjector: fields => fields.reduce((acc, value) => {
    acc[[value]] = 1;

    return acc;
  }, {}),

  ObjectID: mongodb.ObjectID
};

exports.redis = new Redis(appConfig.redis);
