var assert = require('assert');

exports.insert = function(user, db, callback) {
   db.collection('users').insertOne(user, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted User.");
    callback(result);
  });
};

exports.find = function(user,db,callback){
  db.collection('users').findOne({
     "email" : user.email,
     "password" : user.password
  }, function(err, result) {
    callback(result);
  });
};
