/*jshint -W079 */
'use strict';

var Collection = require('../models/collection.js');
var Twitter    = require('../models/twitter.js');
var Twitters   = require('../routes/twitters.js');
var Facebook   = require('../models/facebook.js');
var Facebooks  = require('../routes/facebooks.js');
var Instagram  = require('../models/instagram.js');
var Instagrams = require('../routes/instagrams.js');

exports.index = function(req, res){
  Collection.findByUserId(req.session.userId, function(records){
    var connects = {};
    Twitter.findByUserId(req.session.userId, function(trecord){
      if(trecord){
        connects.twit = '1';
      }else{
        connects.twit = '2';
      }
      Instagram.findByUserId(req.session.userId, function(irecord){
        if(irecord){
          connects.insta = '1';
        }else{
          connects.insta = '2';
        }
        Facebook.findByUserId(req.session.userId, function(frecord){
          if(frecord){
            connects.face = '1';
          }else{
            connects.face = '2';
          }
          res.render('./views/collections/index.ejs', {collections: records, twit: connects.twit, insta: connects.insta, face: connects.face});
        });
      });
    });
  });
};

exports.create = function(req, res){
  var collection = new Collection(req.session.userId, req.body);
  collection.save(function(record){
    res.redirect('/collections');
  });
};

exports.edit = function(req, res){
  // Collection.findByUserIdAndName(req.session.userId, req.body.name, function(collect){
    var collection = new Collection(req.session.userId, req.body);
    collection.update(req.body._id, function(count){
      res.redirect('/collections');
    });
  // });
};

exports.delete = function(req, res){
  Collection.deleteById(req.body._id, function(count){
    res.redirect('/collections');
  });
};
