/*jshint -W079 */
'use strict';

var graph        = require('fbgraph');
var Twit         = require('twitter');
var CronJob      = require('cron').CronJob;
var insta        = require('instagram-node').instagram();
var Auth         = require('../lib/auth.js');
var Twitter      = require('../models/twitter.js');
var Twitters     = require('../routes/twitters.js');
var TwitContent  = require('../models/twitcontent.js');
var Facebook     = require('../models/facebook.js');
var Facebooks    = require('../routes/facebooks.js');
var FaceContent  = require('../models/facecontent.js');
var Instagram    = require('../models/instagram.js');
var Instagrams   = require('../routes/instagrams.js');
var InstaContent = require('../models/instacontent.js');
var Collection   = require('../models/collection.js');
var Collections  = require('../routes/collections.js');

//======== INSTAGRAM START ========//
function getInstagramContent(){
  console.log("INSTAGRAM CRON JOB IS RUNNING...");
  Collection.findByInstagram(function(collections){
    for(var i = 0; i < collections.length; i++){
      eachInstaCollection(collections[i]);
    }
  });
}

function eachInstaCollection(collection){
  Instagram.findByUserId(collection.userId, function(instagram){
    insta.use({access_token: instagram.accessToken});
    var ops = {count: 100};
    getRecentInstagrams(collection.hashtag, ops);
  });
}

function getRecentInstagrams(tag, ops){
  insta.tag_media_recent(tag, ops, function(err, medias, pagination, remaining, limit){
    if(medias){
      var minus = medias.length - 1;
      for(var i = 0; i < medias.length; i++){
        eachInstagram(medias[i], tag, i, pagination, minus);
      }
    }
  });
}

function eachInstagram(media, tag, i, paging, minus){
  InstaContent.findBySocialId(media.id, function(instacontent){
    if(!instacontent){
      var instaContent = new InstaContent(tag, media);
      instaContent.save(function(){});
      if(i === minus && paging && paging.next_max_tag_id){
        var opts = {max_tag_id: paging.next_max_tag_id, count: 100};
        getRecentInstagrams(tag, opts);
      }
    }
  });
}

var instagramJob = new CronJob({
  cronTime: '5,35 0-59 0-23 1-31 0-11 0-6',
  onTick: getInstagramContent,
  start: false
});
//======== INSTAGRAM END ========//

//======== FACEBOOK START ========//
function getFacebookContent(){
  console.log("FACEBOOK CRON JOB IS RUNNING...");
  Facebook.findAll(function(facebooks){
    for(var i = 0; i < facebooks.length; i++){
      graph.setAccessToken(facebooks[i].access_token);
      eachFacebook(facebooks[i]);
    }
  });
}

function eachFacebook(facebook, pagingUrl){
  var faceCall;
  if(pagingUrl){
    faceCall = pagingUrl;
  }else{
    faceCall = facebook.account[2] + "/feed?limit=250";
  }
  graph.get(faceCall, function(err, feed){
    if(feed){
      var minus = feed.data.length - 1;
      for(var i = 0; i < feed.data.length; i++){
        eachFBPost(feed.data[i], facebook.userId, i, feed.paging, minus, facebook);
        if(feed.data[i].type === 'photo'){
          console.log(JSON.stringify("PHOTO: " + feed.data[i].object_id));
        }
        if(feed.data[i].type === 'video'){
          console.log(JSON.stringify("VIDEO: " + feed.data[i].object_id));
        }
        if(feed.data[i].type === 'link'){
          console.log(JSON.stringify("LINK: " + feed.data[i].object_id));
        }
        if(feed.data[i].type === 'status'){
          console.log(JSON.stringify("STATUS: " + feed.data[i].object_id));
        }
      }
    }
  });
}

function eachFBPost(post, userId, i, paging, minus, fb){
  FaceContent.findBySocialId(post.id, function(facecontent){
    if(!facecontent){
      var faceContent = new FaceContent(userId, post);
      faceContent.save(function(){});
      if(i === minus && paging && paging.next){
        eachFacebook(fb, paging.next);
      }
    }
  });
}

var facebookJob = new CronJob({
  cronTime: '15,45 0-59 0-23 1-31 0-11 0-6',
  onTick: getFacebookContent,
  start: false
});
//======== FACEBOOK END ========//

//======== TWITTER START ========//
function getTwitterContent(){
  console.log("TWITTER CRON JOB IS RUNNING...");
  Collection.findByTwitter(function(collections){
    for(var i = 0; i < collections.length; i++){
      eachTwitCollection(collections[i]);
    }
  });
}

function eachTwitCollection(collection){
  Twitter.findByUserId(collection.userId, function(twitter){
    var client = setTwitterClient(twitter);
    var tag = "%23"+collection.hashtag;
    getRecentTweets(collection.hashtag, client, tag);
  });
}

function setTwitterClient(twitter){
  var client = new Twit({
    consumer_key: Auth.twitterAuth.consumerKey,
    consumer_secret: Auth.twitterAuth.consumerSecret,
    access_token_key: twitter.accessToken,
    access_token_secret: twitter.accessTokenSecret
  });
  return client;
}

function getRecentTweets(hash, client, tag, opts, n){
  var params, i;
  if(opts && n){
    params = opts;
    i = 1;
  }else{
    params = {q: tag, count: 100, include_entities: 1, result_type: 'recent'};
    i = 0;
  }
  client.get('search/tweets', params, function(error, tweets, response){
    if (tweets){
      var minus = tweets.statuses.length - 1;
      for(i; i < tweets.statuses.length; i++){
        eachTweet(tweets.statuses[i], tag, i, tweets.search_metadata.max_id, minus, client, hash);
      }
    }
  });
}

function eachTweet(tweet, tag, i, max, minus, client, hash){
  TwitContent.findBySocialId(tweet.id, function(twitcontent){
    if(!twitcontent){
      var twitContent = new TwitContent(hash, tweet);
      twitContent.save(function(){});
      if(i === minus && max && tweet){
        var params = {q: tag, count: 100, include_entities: 1, result_type: 'recent', max_id: tweet.id};
        getRecentTweets(hash, client, tag, params, 1);
      }
    }
  });
}

var twitterJob = new CronJob({
  cronTime: '25,55 0-59 0-23 1-31 0-11 0-6',
  onTick: getTwitterContent,
  start: false
});
//======== TWITTER END ========//

exports.start = function(){
  instagramJob.start();
  // facebookJob.start();
  twitterJob.start();
};
