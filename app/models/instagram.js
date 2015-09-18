/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function Instagram(id, data){
  this.userId             = data.userId ? data.userId : id;
  this.accessToken        = data.accessToken ? data.accessToken : '1';
  if(data._id){this._id   = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(Instagram, 'collection', {
  get: function(){return global.visualive.collection('instagrams');}
});

Instagram.prototype.save = function(fn){
  var self = this;
  Instagram.collection.findOne({userId: self.userId}, function(err, record){
    if(!record){
      Instagram.collection.insert(self, function(err, records){
        fn(records);
      });
    }else{
      fn(null);
    }
  });
};

Instagram.findByUserId = function(id, fn){
  Instagram.collection.findOne({userId: id}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(null);
    }
  });
};

Instagram.prototype.updateAccessToken = function(token, fn){
  var self = this;
  Instagram.collection.update({userId: self.userId}, {$set: {accessToken: token}}, function(err, count){
    fn(count);
  });
};

Instagram.deleteByUserId = function(id, fn){
  Instagram.collection.remove({userId: id}, function(err, count){
    fn(count);
  });
};

module.exports = Instagram;
