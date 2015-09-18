/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function Collection(id, data){
  this.userId           = data.userId ? data.userId : id;
  this.name             = data.name;
  this.hashtag          = data.hashtag;
  this.twitter          = data.twitter;
  this.instagram        = data.instagram;
  this.accepted         = data.accepted ? data.accepted : [];
  this.rejected         = data.rejected ? data.rejected : [];
  if(data._id){this._id = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(Collection, 'collection', {
  get: function(){return global.visualive.collection('collections');}
});

Collection.prototype.save = function(fn){
  Collection.collection.insert(this, function(err, record){
    fn(record);
  });
};

Collection.prototype.update = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  Collection.collection.update({_id:_id}, {$set: {name: this.name, hashtag: this.hashtag, facebook: this.facebook, twitter: this.twitter, instagram: this.instagram}}, function(err, count){
    fn(count);
  });
};

Collection.prototype.updateAccepted = function(idee, fn){
  var id = new Mongo.ObjectID(idee);
  Collection.collection.update({_id:id}, {$set: {accepted: this.accepted}}, function(err, count){
    fn(count);
  });
};

Collection.prototype.updateRejected = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  Collection.collection.update({_id:_id}, {$set: {rejected: this.rejected}}, function(err, count){
    fn(count);
  });
};

Collection.findAll = function(fn){
  Collection.collection.find().toArray(function(err, records){
    fn(records);
  });
};

Collection.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  Collection.collection.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

Collection.findByUserId = function(id, fn){
  Collection.collection.find({userId:id}).toArray(function(err, records){
    fn(records);
  });
};

Collection.findByUserIdAndName = function(id, title, fn){
  Collection.collection.findOne({userId:id, name: title}, function(err, record){
    fn(record);
  });
};

Collection.findByTwitter = function(fn){
  Collection.collection.find({twitter: 'on'}).toArray(function(err, records){
    fn(records);
  });
};

Collection.findByInstagram = function(fn){
  Collection.collection.find({instagram: 'on'}).toArray(function(err, records){
    fn(records);
  });
};

Collection.findByTwitterAndUserId = function(id, fn){
  Collection.collection.find({userId: id, twitter: 'on'}).toArray(function(err, records){
    fn(records);
  });
};

Collection.findByInstagramAndUserId = function(id, fn){
  Collection.collection.find({userId: id, instagram: 'on'}).toArray(function(err, records){
    fn(records);
  });
};

Collection.findAllAccepted = function(id, fn){
  Collection.collection.find({userId: id}).toArray(function(err, records){
    var accepts = [];
    for(var i = 0; i < records.length; i++){
      var object = {hashtag: records[i].hashtag, accept: records[i].accepted};
      accepts.push(object);
      if(i = records.length -1){
        fn(accepts);
      }
    }
  });
};

Collection.deleteById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  Collection.collection.remove({_id: mongoId}, function(err, count){
    fn(count);
  });
};

module.exports = Collection;
