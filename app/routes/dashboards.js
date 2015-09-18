/*jshint -W079 */
'use strict';

var User = require('../models/user.js');

exports.show = function(req, res){
  User.findById(req.session.userId, function(user){
    res.render('./views/dashboard/index.ejs', {username:user.username, email: user.email});
  });
};
