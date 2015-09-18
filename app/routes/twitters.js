/*jshint -W079 */
'use strict';

var Twitter    = require('../models/twitter.js');

exports.getTwitterRequest = function(req, res){
  Twitter.findByUserId(req.session.userId, function(cor){
    var twitter;
    if(!cor){
      twitter = new Twitter(req.session.userId, 'Prince');
      twitter.save(function(){
        twitter.getOAuthRequestToken(function(count, oauths){
          if(count){
            req.session.oauth = {twitter: {request_token: oauths[0]}};
            req.session.oauth.twitter.request_token_secret = oauths[1];
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + req.session.oauth.twitter.request_token);
          }
        });
      });
    }else{
      twitter = new Twitter(cor.userId, cor);
      twitter.getOAuthRequestToken(function(count, oauths){
        if(count){
          req.session.oauth.twitter.request_token = oauths[0];
          req.session.oauth.twitter.request_token_secret = oauths[1];
          res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + req.session.oauth.twitter.token);
        }
      });
    }
  });
};

exports.getTwitterAccess = function(req, res){
  if(req.query.oauth_verifier){
    req.session.oauth.twitter.verifier = req.query.oauth_verifier;
    Twitter.findByUserId(req.session.userId, function(cor){
      if(cor){
        var twitter = new Twitter(cor.userId, cor);
        twitter.getOAuthAccessToken(req.session.oauth.twitter.request_token, req.session.oauth.twitter.request_token_secret, req.session.oauth.twitter.verifier, function(count, oauths){
          req.session.oauth.twitter.access_token = oauths[0];
          req.session.oauth.twitter.access_token_secret = oauths[1];
          res.redirect('/sources');
        });
      }
    });
  }else{
    res.redirect('/sources');
  }
};

exports.getTwitterDelete = function(req, res){
  Twitter.deleteByUserId(req.session.userId, function(count){
    res.redirect('/sources');
  });
};
