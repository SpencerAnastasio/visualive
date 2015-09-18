/*jshint -W079 */
'use strict';

var Twitter   = require('../models/twitter.js');
var Instagram = require('../models/instagram.js');
var Facebook  = require('../models/facebook.js');

exports.index = function(req, res){
  var fhandle, thandle, ihandle, pages, account;
  Twitter.findByUserId(req.session.userId, function(trecord){
    if(trecord){
      thandle = '1';
    }else{
      thandle = '2';
    }
    Instagram.findByUserId(req.session.userId, function(irecord){
      if(irecord){
        ihandle = '1';
      }else{
        ihandle = '2';
      }
      Facebook.findByUserId(req.session.userId, function(frecord){
        if(frecord){
          pages = frecord.pages;
          account = frecord.account;
          fhandle = '1';
        }else{
          pages = [];
          account = [];
          fhandle = '2';
        }
        res.render('./views/sources/index.ejs', {account: account, pages: pages, twit: thandle, face: fhandle, insta: ihandle});
      });
    });
  });
};
