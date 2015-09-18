'use strict';

var User = require('../models/user');

module.exports = function(req, res, next){

  if(req.url === '/' || req.url === '/register'){
    next();
  }else{
    if(req.session.userId){
      next();
    // }else if(req.user.facebookId){
    //   var FId = req.user.facebookId;
    //   User.findByFacebookId(FId.toString(), function(record){
    //     if(record.role){next();}
    //     else{res.redirect('/');}
    //   });
    }else{
      res.redirect('/');
    }
  }
};
