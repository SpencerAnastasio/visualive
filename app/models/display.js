/*jshint -W079 */
'use strict';

var fs    = require('fs');
var path  = require('path');
var Mongo = require('mongodb');

function Display(id, data){
  this.userId           = data.userId ? data.userId : id;
  this.name             = data.name ? data.name : "string";
  this.collections      = data.collections ? data.collections : [];
  // this.template         = data.template ? data.logo : "string";
  this.bg               = data.bg ? data.bg : "string";
  this.logo             = data.logo ? data.logo : "string";
  if(data._id){this._id = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(Display, 'collection', {
  get: function(){return global.visualive.collection('displays');}
});

Display.prototype.save = function(fn){
  Display.collection.insert(this, function(err, record){
    fn(record);
  });
};

Display.prototype.update = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  Display.collection.update({_id:_id}, {$set: {name: this.name, collections: this.collections, bg: this.bg, logo: this.logo}}, function(err, count){
    fn(count);
  });
};

Display.findAll = function(fn){
  Display.collection.find().toArray(function(err, records){
    fn(records);
  });
};

Display.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  Display.collection.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

Display.findByUserId = function(id, fn){
  Display.collection.find({userId:id}).toArray(function(err, records){
    fn(records);
  });
};

Display.deleteById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  Display.collection.remove({_id: mongoId}, function(err, count){
    fn(count);
  });
};

function doFiles(s, ext, op){
  var name = s.name.replace(/\s/g , '');
  name = name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  var rp = s.userId + '/';
  var rp2 = name + '/';
  var ap = __dirname + '/../static/img/';
  var np = rp + rp2 + ext;
  if(fs.existsSync(ap + rp)){
    if(fs.existsSync(ap + rp + rp2)){
      fs.renameSync(op, ap + np);
      return np;
    }else{
      fs.mkdirSync(ap + rp + rp2);
      fs.renameSync(op, ap + np);
      return np;
    }
  }else{
    fs.mkdirSync(ap + rp);
    fs.mkdirSync(ap + rp + rp2);
    fs.renameSync(op, ap + np);
    return np;
  }
}

Display.prototype.addBg = function(op, fn){
  var extension = path.extname(op);
  var ext = 'bg' + extension;
  var np = doFiles(this, ext, op);
  this.bg = np;
  fn();
};

Display.prototype.addLogo = function(op, fn){
  var extension = path.extname(op);
  var ext = 'logo' + extension;
  var np = doFiles(this, ext, op);
  this.logo = np;
  fn();
};

module.exports = Display;
