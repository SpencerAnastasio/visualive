/*jshint -W079 */
'use strict';

var Facebook     = require('../models/facebook.js');
var oauth        = require('../lib/auth.js');
var graph        = require('fbgraph');
var clientId     = oauth.facebookAuth.clientID;
var clientSecret = oauth.facebookAuth.clientSecret;
var callbackUrl  = oauth.facebookAuth.callbackURL;
var scope        = oauth.facebookAuth.scope;

exports.getFacebookRequest = function(req, res){
  var authUrl = graph.getOauthUrl(
    {
      "client_id"    : clientId,
      "redirect_uri" : callbackUrl,
      "scope"        : scope
    }
  );
  res.redirect(authUrl);
};

exports.getFacebookAccess = function(req, res){
  console.log(req);
  graph.authorize(
    {
      "client_id"     : clientId,
      "redirect_uri"  : callbackUrl,
      "client_secret" : clientSecret,
      "code"          : req.query.code
    },
    function(err, facebookResponse){
      if(facebookResponse){
        graph.extendAccessToken(
          {
            "grant_type"        : "fb_exchange_token",
            "client_id"         : clientId,
            "client_secret"     : clientSecret,
            "fb_exchange_token" : facebookResponse.access_token
          },
          function(err, facebookRes){
            Facebook.findByUserId(req.session.userId, function(record){
              var facebook;
              if(!record){
                facebook = new Facebook(req.session.userId, facebookRes);
                facebook.save(function(){
                  getFacebookPages(facebook, function(bool){
                    if(bool === 'true'){
                      res.redirect('/sources');
                    }
                  });
                });
              }else{
                facebook = new Facebook(req.session.userId, record);
                facebook.updateAccessToken(facebookRes, function(){
                  getFacebookPages(facebook, function(bool){
                    if(bool === 'true'){
                      res.redirect('/sources');
                    }
                  });
                });
              }
            });
          }
        );
      }
    }
  );
};

function getFacebookPages(facebook, fn){
  var pages = [];
  Facebook.findByUserId(facebook.userId, function(record){
    if(record){
      graph.setAccessToken(record.access_token);
      graph.get("me?fields=accounts", function(err, res){
        for(var i = 0; i < res.accounts.data.length; i++){
          console.log(res.accounts.data[0]);
          var page = {id: res.accounts.data[i].id, name: res.accounts.data[i].name};
          pages.push(page);
        }
        facebook.updatePages(pages, function(count){
          if(count){
            fn('true');
          }
        });
      });
    }
  });
}

exports.setFacebookPage = function(req, res){
  Facebook.findByUserId(req.session.userId, function(record){
    graph.setAccessToken(record.access_token);
    graph.get("326420354059410/picture", function(err, photo){
      var facebook = new Facebook(req.session.userId, record);
      var account = [req.body.pageName, photo.location, req.body.pageId];
      facebook.updateAccount(account, function(count){
        res.redirect('/sources');
      });
    });
  });
};

exports.getFacebookDelete = function(req, res){
  Facebook.deleteByUserId(req.session.userId, function(count){
    res.redirect('/sources');
  });
};
