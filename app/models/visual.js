/*jshint -W079 */
'use strict';

var Mongo = require('mongodb');

function Kinect(id, data){
  this.name               = data.name;
  this.userId             = data.userId ? data.userId : id;
  this.collections        = data.collections ? data.collection : [];
  if(data._id){this._id   = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(Kinect, 'collection', {
  get: function(){return global.visualive.collection('kinects');}
});

Kinect.prototype.save = function(fn){
  var self = this;
  Kinect.collection.findOne({userId: self.userId}, function(err, record){
    if(!record){
      Kinect.collection.insert(self, function(err, records){
        fn(records);
      });
    }else{
      fn(null);
    }
  });
};

Kinect.prototype.updateKinect = function(data, fn){
  var self = this;
  Kinect.collection.update({userId:self.userId}, {$set: {account: data}}, function(err, count){
    fn(count);
  });
};

Kinect.findByUserId = function(id, fn){
  Kinect.collection.findOne({userId:id}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(null);
    }
  });
};

Kinect.deleteByUserId = function(id, fn){
  Kinect.collection.remove({userId: id}, function(err, count){
    fn(count);
  });
};

Kinect.deleteById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  Kinect.collection.remove({_id: mongoId}, function(err, count){
    fn(count);
  });
};

module.exports = Kinect;
