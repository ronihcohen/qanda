var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://10.0.0.4:27017/test';
// db services
var session = require('./services/session.js');
var questions = require('./services/questions.js');
var users = require('./services/users.js');

app.use( bodyParser.json() );
app.set('view engine', 'jade');
app.use(express.static('public'));

app.use('/api/', function (req, res, next) {
  // Checks if user access token is in DB
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);
  console.log('Request Authorization:', req.headers.authorization);

  var user = req.body;

  MongoClient.connect(url, function(err, db) {
    session.find(req.headers.authorization,db,function(user){
      if (user!==null){
        req.user = user;
        console.log('User is OK.');
          next();
      } else {
        console.log('User is not OK.');
        res.sendStatus(401);
      }
    });
  });
});

app.get('/api/test', function (req, res) {

  var message = {
    'userId': req.user.id,
    'message': 'Hey, my name is '+ req.user.first_name
  };

  MongoClient.connect(url, function(err, db) {
    questions.insert(message, db, function(){
      res.sendStatus(200);
    });
  });

});

app.post('/login', function (req, res) {
  // Add user access token to db if is valid.
  session.isValid(req.headers.authorization,function(fbRes){
    if (fbRes.verified){
      fbRes.authorization = req.headers.authorization;

      MongoClient.connect(url, function(err, db) {
        session.insert(fbRes, db, function(){
          console.log(fbRes);
          res.sendStatus(200);
        });
      });
    } else {
      console.log('Access token '+req.headers.authorization+' is not valid.');
      res.sendStatus(401);
    }
  });

});

app.post('/register', function (req, res) {
  var user = {
    email: req.body.email,
    password: req.body.password
  };
  MongoClient.connect(url, function(err, db) {
    users.insert(user, db, function(res){
      console.log(res);
    });
  });
  res.sendStatus(200);
});

app.post('/loginLocal', function (req, res) {
  var user = {
    email: req.body.email,
    password: req.body.password
  };
  MongoClient.connect(url, function(err, db) {
    users.find(user, db, function(res){
      console.log(res);
    });
  });
  res.sendStatus(200);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
