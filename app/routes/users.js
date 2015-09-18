'use strict';

var User = require('../models/user.js');
var Twitter = require('../models/twitter.js');

exports.getLogin = function(req, res){
  if(req.session.userId){
    res.redirect('/dashboard');
  }else{
    res.render('./views/users/login.ejs');
  }
};

exports.login = function(req, res){
  User.findByUsernameAndPassword(req.body.username, req.body.password, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId          = user._id.toString();
        req.session.oauth           = {};
        req.session.oauth.twitter   = {};
        req.session.oauth.instagram = {};
        req.session.oauth.facebook  = {};
        req.session.save(function(){
          Twitter.findByUserId(req.session.userId, function(record){
            if(record){
              req.session.oauth.twitter.access_token = record.accessToken;
              req.session.oauth.twitter.access_token_secret = record.accessTokenSecret;
            }
            res.redirect('/dashboard');
          });
        });
      });
    }else{
      req.session.destroy(function(err){
        res.render('./views/users/login.ejs', {error: "Bad login."});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(err){
    res.redirect('/');
  });
};

exports.getRegister = function(req, res){
  if(req.session.userId){
    res.redirect('/dashboard');
  }else{
    res.render('./views/users/register.ejs');
  }
};

exports.register = function(req, res){
  var user = new User(req.body);
  user.hashPassword(function(){
    user.save(function(){
      if(user._id){
        res.redirect('/');
      } else {
        res.render('./views/users/register.ejs', {error: "User already exists."});
      }
    });
  });
};
