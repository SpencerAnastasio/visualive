'use strict';
var port = 'string';
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:'+port+'/' + 'visualive';
var initialized = false;

exports.connect = function(req, res, next){
  if(!initialized){
    initialized = true;
    exports.db(next);
  }else{
    next();
  }
};

exports.db = function(fn){
  MongoClient.connect(mongoUrl, function(err, db) {
    if(err){throw err;}
    global.visualive = {};
    global.visualive.db = db;
    console.log('Connected to MongoDB');
    fn();
  });
};
