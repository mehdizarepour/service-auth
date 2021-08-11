const mongodb = require('mongodb');

// Connection URL
const url = 'mongodb://mongodb:27017/authdb';

let database;

exports.db = {
  collection: async name => {
    if (database) {
      return database.collection(name);
    }

    const client = await mongodatabase.MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    database = client.db('authdb');

    return database.collection(name);
  },

  fieldProjector: fields => fields.reduce((acc, value) => {
    acc[[value]] = 1;

    return acc;
  }, {}),

  ObjectID: mongodb.ObjectID
};
