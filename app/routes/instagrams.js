/*jshint -W079 */
'use strict';

var Instagram     = require('../models/instagram.js');
var instafn       = require('instagram-node').instagram();

exports.getInstagramRequest = function(req, res){
  Instagram.findByUserId(req.session.userId, function(cor){
    var instagram;
    if(!cor){
      instagram = new Instagram(req.session.userId, 'Prince');
      instagram.save(function(){
        res.redirect(
          instafn.get_authorization_url({scope: ['likes']})
        );
      });
    }else{
      res.redirect(
        instafn.get_authorization_url({scope: ['likes']})
      );
    }
  });
};

exports.getInstagramAccess = function(req, res){
  instafn.authorize_user(req.query.code, function(err, result){
    if(err){
      console.log('INSTAGRAM OAUTH ERROR: ' + err);
      res.send("Didn't work");
    }else{
      Instagram.findByUserId(req.session.userId, function(cor){
        if(cor){
          var instagram = new Instagram(cor.userId, cor);
          instagram.updateAccessToken(result.access_token, function(count){
            if(count){
              req.session.oauth = {instagram: {access_token: result.access_token}};
              res.redirect('/sources');
            }
          });
        }
      });
    }
  });
};

exports.getInstagramDelete = function(req, res){
  Instagram.deleteByUserId(req.session.userId, function(count){
    res.redirect('/sources');
  });
};
