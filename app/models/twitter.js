/*jshint -W079 */
'use strict';

var Mongo   = require('mongodb');
var Auth    = require('../lib/auth.js');
var OAuth   = require('../../node_modules/twitter-js-client/node_modules/oauth').OAuth;
var qs      = require('../../node_modules/twitter-js-client/node_modules/qs');
var consumerKey    = Auth.twitterAuth.consumerKey;
var consumerSecret = Auth.twitterAuth.consumerSecret;
var callBackUrl    = Auth.twitterAuth.callbackURL;
var oauth          = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0A',
  callBackUrl,
  'HMAC-SHA1'
);

function Twitter(id, data){
  this.userId             = data.userId ? data.userId : id;
  this.requestToken       = data.requestToken ? data.requestToken : '1';
  this.requestTokenSecret = data.requestTokenSecret ? data.requestTokenSecret : '1';
  this.accessToken        = data.accessToken ? data.accessToken : '1';
  this.accessTokenSecret  = data.accessTokenSecret ? data.accessTokenSecret : '1';
  if(data._id){this._id   = new Mongo.ObjectID(data._id.toString());}
}

Object.defineProperty(Twitter, 'collection', {
  get: function(){return global.visualive.collection('twitters');}
});

Twitter.prototype.save = function(fn){
  var self = this;
  Twitter.collection.findOne({userId: self.userId}, function(err, record){
    if(!record){
      Twitter.collection.insert(self, function(err, records){
        fn(records);
      });
    }else{
      fn(null);
    }
  });
};

Twitter.findByUserId = function(id, fn){
  Twitter.collection.findOne({userId:id}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(null);
    }
  });
};

Twitter.deleteByUserId = function(id, fn){
  Twitter.collection.remove({userId: id}, function(err, count){
    fn(count);
  });
};

Twitter.prototype.getOAuthRequestToken = function(fn){
  var oauths = [];
  var self  = this;
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if(error){
      console.log('TWITTER OAUTH ERROR: ' + error);
      fn(error);
    }else{
      oauths[0] = oauth_token;
      oauths[1] = oauth_token_secret;
      Twitter.collection.update({userId:self.userId}, {$set:{requestToken:oauths[0], requestTokenSecret:oauths[1]}}, function(err, count){
        fn(count, oauths);
      });
    }
  });
};

Twitter.prototype.getOAuthAccessToken = function(ort, orts, ov, fn){
  var oauths = [];
  var self  = this;
  oauth.getOAuthAccessToken(ort, orts, ov, function(error, oauth_access_token, oauth_access_token_secret, results){
    if(error){
      console.log('TWITTER OAUTH ERROR: ' + error);
      fn(error);
    }else{
      oauths[0] = oauth_access_token;
      oauths[1] = oauth_access_token_secret;
      Twitter.collection.update({userId:self.userId}, {$set:{accessToken: oauths[0], accessTokenSecret: oauths[1]}}, function(err, count){
        fn(count, oauths);
      });
    }
  });
};

module.exports = Twitter;
