/*jshint -W079 */
'use strict';
var _            = require('lodash');
// var Kinect       = require('../models/visual.js');
// var Twitter      = require('../models/twitter.js');
// var Twitters     = require('../routes/twitters.js');
// var TwitContent  = require('../models/twitcontent.js');
// var Facebook     = require('../models/facebook.js');
// var Facebooks    = require('../routes/facebooks.js');
var FaceContent  = require('../models/facecontent.js');
// var Instagram    = require('../models/instagram.js');
// var Instagrams   = require('../routes/instagrams.js');
// var InstaContent = require('../models/instacontent.js');
var Collection   = require('../models/collection.js');
var Collections  = require('../routes/collections.js');

exports.kinectShow = function(req, res){
  console.log("REQ DOT PARAMS DOT ID: " + req.params.id);
  Collection.findById(req.params.id, function(record){
    FaceContent.findByTag(record.hashtag, function(content){
      var sends = content.splice(0, 300);
      res.render('./views/visuals/kinect.ejs', {contents: sends});
      // if(content){
      //   getApproved(content, record.accepted, function(send){
      //     var sends = send.splice(0, 300);
      //     res.render('./views/visuals/kinect.ejs', {contents: sends});
      //   });
      // }
    });
  });
};

function getApproved(con, ra, fn){
  var sends = [];
  for(var i = 0; i < ra.length; i++){
    for(var j = 0; j < con.length; j++){
      if(con[j]._id.toString() === ra[i]){
        sends.push(con[j]);
      }
    }
  }
  fn(sends);
}

exports.kindex = function(req, res){
  FaceContent.findAll(function(content){
    var contains = content.splice(0, 300);
    res.send({contents: contains});
  });
};
