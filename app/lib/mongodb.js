'use strict';

var MongoClient = require('mongodb').MongoClient;

module.exports = function(url, cb){
  MongoClient.connect(url, function(err, db){
    console.log("mongo is working");
    global.visualive = db;
    console.log('Express: Database', url);
    if(cb){
      console.log("cb is true");
      cb();
    }else{
      console.log("cb is false");
    }
  });
};
