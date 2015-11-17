var assert = require('assert');

exports.insert = function(message, db, callback) {
   db.collection('questions').insertOne(message, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted message.");
    callback(result);
  });
};
