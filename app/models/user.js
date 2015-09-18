'use strict';

var Mongo  = require('mongodb');
var bcrypt = require('bcrypt');

function User(data){
  this.username    = data.username;
  this.email       = data.email;
  this.password    = data.password;
  if(data._id){this._id = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.visualive.collection('blowers');}
});

User.prototype.hashPassword = function(fn){
  var self = this;
  bcrypt.hash(self.password, 8, function(err, hash){
    self.password = hash;
    fn(err);
  });
};

User.prototype.comparePassword = function(fn, record){
  var self = this;
  bcrypt.compare(self.password, record.password, function(err, result){
    fn(result);
  });
};

User.prototype.save = function(fn){
  var self = this;
  User.collection.findOne({username: self.username}, function(err, record){
    if(!record){
      User.collection.findOne({email: self.email}, function(err,record){
        if(!record){
          User.collection.insert(self, function(err, records){
            fn(records[0]);
          });
        }else{
          fn(null);
        }
      });
    }else{
      fn(null);
    }
  });
};

User.findByUsernameAndPassword = function(username, password, fn){
  User.collection.findOne({username: username}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result){
          fn(record);
        }else{
          fn(null);
        }
      });
    }else{
      fn(null);
    }
  });
};

User.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  User.collection.findOne({_id: mongoId}, function(err, record){
    fn(record);
  });
};

module.exports = User;
