var assert = require('assert');
var https = require('https');

exports.insert = function(fbRes, db, callback) {
   db.collection('session').insertOne(fbRes, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted User to session.");
    callback(result);
  });
};

exports.find = function(authorization,db,callback){
  db.collection('session').findOne({
     "authorization" : authorization
  }, function(err, result) {
    callback(result);
  });
};

exports.isValid = function(accessToken,callback) {
    return https.get({
        host: 'graph.facebook.com',
        path: '/me?access_token='+accessToken
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback(parsed);
        });
    });
};
