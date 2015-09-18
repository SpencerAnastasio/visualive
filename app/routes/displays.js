/*jshint -W079 */
'use strict';

var Collection  = require('../models/collection.js');
var Collections = require('../routes/collections.js');
var Display     = require('../models/display.js');
var Displays    = require('../routes/displays.js');

exports.index = function(req, res){
  var contents = [];
  Collection.findByUserId(req.session.userId, function(collections){
    Display.findByUserId(req.session.userId, function(displays){
      res.render('./views/displays/index.ejs', {collections: collections, displays: displays});
    });
  });
};

exports.create = function(req, res){
  var rbc = [];
  if(typeof req.body.collections === 'object'){
    for(var i = 0; i < req.body.collections.length; i++){
      var array = req.body.collections[i].split(",");
      var object = {name: array[0], _id: array[1]};
      rbc.push(object);
    }
  }else{
    var array = req.body.collections.split(",");
    var object = {name: array[0], _id: array[1]};
    rbc.push(object);
  }
  req.body.collections = rbc;
  var display = new Display(req.session.userId, req.body);
  display.addBg(req.files.bg.path, function(){
    display.addLogo(req.files.logo.path, function(){
      display.save(function(record){
        res.redirect('/displays');
      });
    });
  });
};

function getCollObject(rbc, fn){
  var minus = rbc.length - 1;
  for(var i = 0; i < rbc.length; i++){
    Collection.findById(rbc[i], function(coll){
      var object = {'name': coll.name, '_id': coll._id};
      rbc.splice(i, 1, object);
    });
  }
  fn(rbc);
}

exports.edit = function(req, res){
  var rbc = [];
  if(typeof req.body.collections === 'object'){
    for(var i = 0; i < req.body.collections.length; i++){
      var array = req.body.collections[i].split(",");
      var object = {name: array[0], _id: array[1]};
      rbc.push(object);
    }
  }else{
    var array = req.body.collections.split(",");
    var object = {name: array[0], _id: array[1]};
    rbc.push(object);
  }
  req.body.collections = rbc;
  var display = new Display(req.session.userId, req.body);
  display.addBg(req.files.bg.path, function(){
    display.addLogo(req.files.logo.path, function(){
      display.update(req.body._id, function(count){
        res.redirect('/displays');
      });
    });
  });
  display.update(req.body._id, function(count){
};

exports.delete = function(req, res){
  Display.deleteById(req.body._id, function(count){
    res.redirect('/displays');
  });
};
