/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function TwitContent(tag, data){
  this.network                 = 'twitter';
  this.hashtag                 = tag;
  this.type                    = data.entities.media ? data.entities.media[0].type : null;
  this.mediaUrl                = data.entities.media ? data.entities.media[0].media_url : null;
  this.mediaHTTPS              = data.entities.media ? data.entities.media[0].media_url_https : null;
  this.url                     = data.entities.media ? data.entities.media[0].url : null;
  this.displayUrl              = data.entities.media ? data.entities.media[0].display_url : null;
  this.expandedUrl             = data.entities.media ? data.entities.media[0].expanded_url : null;
  this.caption                 = data.text;
  this.createdTime             = data.created_at;
  this.socialId                = data.id;
  this.name                    = data.user.name;
  this.screenName              = data.user.screen_name;
  this.profilePic              = data.user.profile_image_url;
  this.profilePicHTTPS         = data.user.profile_image_url_https;
  if(data._id){this._id        = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(TwitContent, 'collection', {
  get: function(){return global.visualive.collection('contents');}
});

TwitContent.prototype.save = function(fn){
  TwitContent.collection.insert(this, function(err, record){
    fn(record);
  });
};

TwitContent.findAll = function(fn){
  TwitContent.collection.find({network: 'twitter'}).toArray(function(err, records){
    records = records.reverse();
    fn(records);
  });
};

TwitContent.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  TwitContent.collection.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

TwitContent.findBySocialId = function(id, fn){
  TwitContent.collection.findOne({socialId: id}, function(err, record){
    fn(record);
  });
};

TwitContent.deleteByTag = function(tag, fn){
  TwitContent.collection.remove({hashtag: tag}, function(err, count){
    fn(count);
  });
};

module.exports = TwitContent;
