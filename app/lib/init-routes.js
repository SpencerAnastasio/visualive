'use strict';

var initialized      = false;
var d                = require('../lib/request-debug');
var users            = require('../routes/users.js');
var sources          = require('../routes/sources.js');
var twitters         = require('../routes/twitters.js');
var facebooks        = require('../routes/facebooks.js');
var instagrams       = require('../routes/instagrams.js');
var collections      = require('../routes/collections.js');
var displays         = require('../routes/displays.js');
var visuals          = require('../routes/visuals.js');
var moderates        = require('../routes/moderates.js');
var dashboards       = require('../routes/dashboards.js');
var lookup           = require('../lib/lookup-user.js');
var bounce           = require('../lib/bounce-user.js');

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  //-------- LOGIN PAGE --------//
  app.get('/', d, users.getLogin);
  app.post('/', d, users.login);

  //-------- REGISTER PAGE --------//
  app.get('/register', d, users.getRegister);
  app.post('/register', d, users.register);

  //-------- DASHBOARD PAGE --------//
  app.get('/dashboard', bounce, d, dashboards.show);

  //-------- SOURCES PAGE --------//
  app.get('/sources', bounce, d, sources.index);

  //-------- TWITTER API --------//
  app.get('/twitterReq', bounce, d, twitters.getTwitterRequest);
  app.get('/twitterAcc', bounce, d, twitters.getTwitterAccess);
  app.get('/twitterDis', bounce, d, twitters.getTwitterDelete);

  //-------- INSTAGRAM API --------//
  app.get('/instagramReq', bounce, d, instagrams.getInstagramRequest);
  app.get('/instagramAcc', bounce, d, instagrams.getInstagramAccess);
  app.get('/instagramDis', bounce, d, instagrams.getInstagramDelete);

  //-------- FACEBOOK API --------//
  app.get('/facebookReq', bounce, d, facebooks.getFacebookRequest);
  app.get('/facebookAcc', bounce, d, facebooks.getFacebookAccess);
  app.get('/facebookDis', bounce, d, facebooks.getFacebookDelete);
  app.post('/facebookPage', bounce, d, facebooks.setFacebookPage);

  //-------- COLLECTIONS PAGE --------//
  app.get('/collections', bounce, d, collections.index);
  app.post('/collections', bounce, d, collections.create);
  app.post('/collections/edit', bounce, d, collections.edit);
  app.post('/collections/delete', bounce, d, collections.delete);

  //-------- DISPLAYS PAGE --------//
  app.get('/displays', bounce, d, displays.index);
  app.post('/displays', bounce, d, displays.create);
  app.post('/displays/delete', bounce, d, displays.delete);
  app.post('/displays/edit', bounce, d, displays.edit);
  // app.get('/displays/:visualId', bounce, d, visuals.show);

  //-------- MODERATION PAGE --------//
  app.get('/moderate', bounce, d, moderates.moderateShow);
  app.post('/moderate', bounce, d, moderates.moderateShow);
  // app.get('/moderate/:id', bounce, d, moderates.new);
  // app.post('/moderateCol', bounce, d, moderates.collect);
  app.post('/moderateYes', bounce, d, moderates.yes);
  app.post('/moderateNo', bounce, d, moderates.no);
  // app.post('/collections/delete', bounce, d, collections);

  //-------- VISUALS PAGE --------//
  // app.get('/kinect', bounce, d, visuals.kinectShow);
  app.get('/kinect/:id', bounce, d, visuals.kinectShow);
  app.get('/kindex', bounce, d, visuals.kindex);
  // app.get('/grid', bounce, d, visuals.gridShow);
  // app.get('/displays/:visualId', bounce, d, visuals.show);

  // app.get('/sampleModels', d, sampleModels.index);
  // app.get('/sampleModels/create', d, sampleModels.createPage);
  // app.get('/sampleModels/:id', d, sampleModels.show);
  // app.get('/sampleModels/edit/:id', d, sampleModels.edit);
  // app.get('/auth', d, users.auth);
  // app.post('/sampleModels/create', d, sampleModels.create);
  // app.post('/register', d, users.register);
  // app.post('/login', d, users.login);
  // app.post('/', d, jinglegrams.create);
  // app.post('/logout', d, users.logout);
  // app.post('/sampleModels/update/:id', d, sampleModels.update);
  // app.post('/sampleModels/delete/:id', d, sampleModels.remove);

  //-------- LOGOUT --------//
  app.get('/logout', d, users.logout);

  //-------- 404 PAGE --------//
  app.get('/*', d, function (req, res) {res.render('./views/error/404.ejs', {url:req.url});});

  console.log('Routes Loaded');
  fn();
}
