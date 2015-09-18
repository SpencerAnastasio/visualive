/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function InstaContent(tag, data){
  this.network          = 'instagram';
  this.hashtag          = tag;
  this.type             = data.type;
  this.link             = data.link;
  this.name             = data.user.username;
  this.profilePic       = data.user.profile_picture;
  this.createdTime      = data.created_time;
  this.image            = data.images ? data.images.standard_resolution.url : null;
  this.video            = data.videos ? data.videos.low_resolution.url : null;
  this.caption          = data.caption ? data.caption.text : "#" + tag;
  this.socialId         = data.id;
  if(data._id){this._id = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(InstaContent, 'collection', {
  get: function(){return global.visualive.collection('contents');}
});

InstaContent.prototype.save = function(fn){
  InstaContent.collection.insert(this, function(err, record){
    fn(record);
  });
};

InstaContent.findAll = function(fn){
  InstaContent.collection.find({network: 'instagram'}).toArray(function(err, records){
    records = records.reverse();
    fn(records);
  });
};

InstaContent.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  InstaContent.collection.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

InstaContent.findBySocialId = function(id, fn){
  InstaContent.collection.findOne({socialId: id}, function(err, record){
    fn(record);
  });
};

InstaContent.deleteByTag = function(tag, fn){
  InstaContent.collection.remove({hashtag: tag}, function(err, count){
    fn(count);
  });
};

module.exports = InstaContent;
