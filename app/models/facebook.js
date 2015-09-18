/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function Facebook(id, data){
  this.userId             = data.userId ? data.userId : id;
  this.facebookId         = data.id ? data.id : '1';
  this.access_token       = data.access_token ? data.access_token : '1';
  this.expires            = data.expires ? data.expires : '1';
  this.pages              = data.pages ? data.pages : [];
  this.account            = data.account ? data.account : [];
  if(data._id){this._id   = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(Facebook, 'collection', {
  get: function(){return global.visualive.collection('facebooks');}
});

Facebook.prototype.save = function(fn){
  var self = this;
  Facebook.collection.findOne({userId: self.userId}, function(err, record){
    if(!record){
      Facebook.collection.insert(self, function(err, records){
        fn(records);
      });
    }else{
      fn(null);
    }
  });
};

Facebook.prototype.updateAccessToken = function(data, fn){
  var self = this;
  Facebook.collection.update({userId:self.userId}, {$set: {access_token: data.access_token, expires: data.expires}}, function(err, count){
    fn(count);
  });
};

Facebook.prototype.updatePages = function(data, fn){
  var self = this;
  Facebook.collection.update({userId:self.userId}, {$set: {pages: data}}, function(err, count){
    fn(count);
  });
};

Facebook.prototype.updateAccount = function(data, fn){
  var self = this;
  Facebook.collection.update({userId:self.userId}, {$set: {account: data}}, function(err, count){
    fn(count);
  });
};

Facebook.findAll = function(fn){
  Facebook.collection.find().toArray(function(err, records){
    fn(records);
  });
};

Facebook.findByUserId = function(id, fn){
  Facebook.collection.findOne({userId:id}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(null);
    }
  });
};

Facebook.deleteByUserId = function(id, fn){
  Facebook.collection.remove({userId: id}, function(err, count){
    fn(count);
  });
};

module.exports = Facebook;
