'use strict';

var database         = 'visualive';
// var port             = process.env.PORT || 8080;
var port             = process.env.PORT || 3000;
var url              = 'mongodb://localhost/' + database;
var express          = require('express');
var session          = require('express-session');
var path             = require('path');
var initRoutes       = require('./lib/init-routes.js');
var insta            = require('instagram-node').instagram();
var Collection       = require('./models/collection.js');
var Crons            = require('./routes/crons.js');
var Auth             = require('./lib/auth.js');
var twitterStream    = require('twitter-stream-channels');
var accessToken      = Auth.twitterAuth.accessToken;
var accessSecret     = Auth.twitterAuth.accessTokenSecret;
var consumerKey      = Auth.twitterAuth.consumerKey;
var consumerSecret   = Auth.twitterAuth.consumerSecret;
var callBackUrl      = Auth.twitterAuth.callbackURL;
var app              = express();

require('./lib/mongodb.js')(url);
app.set('views', __dirname, '/views');
app.set('view engine', 'ejs');
insta.use({
  client_id     : 'bf7acb5d25b841a7ae168fc0fea11208',
  client_secret : '3a90d4cf34e64d0e99dee4aa389b385d'
});

//-------- PIPELINE BEGINS --------//
// app.use(initMongo.connect);
// app.use(express.favicon());
Crons.start();
app.use(initRoutes);
app.use(express.logger(':remote-addr -> :method :url [:status]'));
app.use(express.static(path.join(__dirname, '/static')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  store  : new session.MemoryStore(),
  secret : 'change-this-to-a-super-secret-message',
  cookie : {maxAge: 24 * 60 * 60 * 1000}
}));
app.use(app.router);
//-------- PIPELINE ENDS --------//

var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening on port ' + port + ', Database: ' + database);
});

module.exports = app;
