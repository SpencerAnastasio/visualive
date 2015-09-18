/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function FaceContent(id, data){
  this.userId           = id;
  this.network          = 'facebook';
  this.hashtag          = 'facebook';
  this.type             = data.type;
  this.createdTime      = data.updated_time ? data.updated_time : data.created_time;
  this.link             = data.link;
  this.description      = data.description;
  this.name             = data.name;
  this.picture          = data.picture;
  this.video            = data.embed_html;
  this.format           = data.format;
  this.source           = data.source;
  this.imageSpecs       = data.images;
  this.height           = data.height;
  this.width            = data.width;
  this.story            = data.page_story_id;
  this.caption          = data.message;
  this.socialId         = data.id;
  this.from             = data.from;
  if(data._id){this._id = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(FaceContent, 'collection', {
  get: function(){return global.visualive.collection('contents');}
});

FaceContent.prototype.save = function(fn){
  FaceContent.collection.insert(this, function(err, record){
    fn(record);
  });
};

FaceContent.findAll = function(fn){
  FaceContent.collection.find({$query: {}, $orderby: {_id: -1 }}).limit(1000).toArray(function(err, records){
    fn(records);
  });
};

FaceContent.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  FaceContent.collection.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

FaceContent.findBySocialId = function(id, fn){
  FaceContent.collection.findOne({socialId: id}, function(err, record){
    fn(record);
  });
};

FaceContent.findByTag = function(tag, fn){
  FaceContent.collection.find({$query: {hashtag: tag}, $orderby: {_id: -1 }}).limit(1000).toArray(function(err, records){
    fn(records);
  });
};

FaceContent.deleteByTag = function(tag, fn){
  FaceContent.collection.remove({hashtag: tag}, function(err, count){
    fn(count);
  });
};

module.exports = FaceContent;

// type: status ... https://developers.facebook.com/docs/graph-api/reference/v2.2/status
// type: link ... https://developers.facebook.com/docs/graph-api/reference/v2.2/link
// type: video ... https://developers.facebook.com/docs/graph-api/reference/v2.2/video
// type: photo ... https://developers.facebook.com/docs/graph-api/reference/v2.2/photo
// type: event ... https://developers.facebook.com/docs/graph-api/reference/v2.2/event
