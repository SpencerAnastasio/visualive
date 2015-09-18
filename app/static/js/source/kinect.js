(function(){
  'use strict';

  $(document).ready(initialize);

  // Max and Min movement variables
  var maxLeft = 7300;
  var maxRight = -7300;
  var objOffx = 10000 ;
  var objOffy = 800 ;

  var $theater, oldArray, newArray;

  var camera, scene, renderer;
  var controls;
  var panObj;

  var objects = [];
  var items = [];
  var newitems = [];
  var targets = { items: [], newitems: [] };

  function initialize(){
    initIsotope();
    disconnect();
    $('.editbut').click(editForm);
    $('.cancelbut').click(cancelEdit);
    $('#createtoggle').click(toggleCreateForm);
    setInterval(function(){pullNewContent();}, 10000);
  }

  function allGood() {
    $('#theater').imagesLoaded(function(){
      init();
      animate();
      loaded();
      console.log('all good ran');
    });
  }

  function initIsotope(){
    $theater = $('#theater').imagesLoaded(function(){

      $('#theater').isotope({
        itemSelector : '.item',
        masonry: {
          columnWidth : 40
        },
        onLayout: function() {
          allGood();
        }
      });

      console.log('init isotope called');

    });
  }

  function secondIsotope(){

    console.log('init iso 2 called');
    $('#theater').imagesLoaded(function(){
      $('#theater').isotope({
        itemSelector : '.item',
        masonry: {
          columnWidth : 40
        }
      });
    });
  }

  function disconnect(){
    var twit  = $('#twit').text();
    var face  = $('#face').text();
    var insta = $('#insta').text();
    if(twit === '1'){
      $('#tweetConnect').text('Disconnect Twitter');
      $('#tweetConnect').parent().attr("href", "/twitterDis");
    }
    if(insta === '1'){
      $('#instaConnect').text('Disconnect Instagram');
      $('#instaConnect').parent().attr("href", "/instagramDis");
      $('#irebut').removeClass('hidden');
    }
    if(face === '1'){
      $('#fbConnect').text('Disconnect Facebook');
      $('#fbConnect').parent().attr("href", "/facebookDis");
      $('#frebut').removeClass('hidden');
    }
  }

  function editForm(){
    var $this = $(this);
    var lass  = $this.children('.ref').text();
    $('#' + lass).toggleClass('hidden');
    $this.toggleClass('hidden');
    $this.siblings(".cancelbut").toggleClass('hidden');
  }

  function cancelEdit(){
    var $this = $(this);
    var lass  = $this.children('.ref').text();
    $('#' + lass).toggleClass('hidden');
    $this.toggleClass('hidden');
    $this.siblings(".editbut").toggleClass('hidden');
  }

  function toggleCreateForm(){
    $('#createform').toggleClass('hidden');
  }

  function pullNewContent(){
    getSixes();
    var url = 'http://node.vslve.com/kindex';
    $.getJSON(url, makeNewArray);
  }

  function getSixes(){
    oldArray  = [];
    var sixes = $('#theater').find('h6');
    console.log("SIXES: " + sixes.length);
    makeOldArray(sixes);
  }

  function makeOldArray(sixes){
    for(var i = 0; i < sixes.length; i++){
      var sext = sixes[i].innerHTML;
      oldArray.push(sext);
    }
  }

  function makeNewArray(data){
    newArray  = [];
    for(var i = 0; i < data.contents.length; i++){
      var id  = data.contents[i]._id;
      newArray.push(id);
    }
    setTimeout(function(){newIsotope(data.contents);}, 2000);
  }

  function newIsotope(contents){
    var news = _.difference(newArray, oldArray);
    var olds = _.difference(oldArray, newArray);
    console.log(news);
    console.log(olds);
    var imgs = $('#theater').find('.item');
    if(news !== [] && olds !== []){
      removeOlds(olds, imgs);
      prependNews(news, contents);
    }
  }

  function removeOlds(olds, imgs){
    for(var i = 0; i < olds.length; i++){
      for(var j = 0; j < imgs.length; j++){
        if(olds[i] === imgs[j].classList[3]){
          $('.item').remove("." + olds[i]);
          $('h6').remove("." + olds[i]);
        }
      }
    }
  }

  function prependNews(news, contents){
    var elements = getElements(news, contents);
    $theater.prepend(elements);
    $('#three').prepend(elements);
    $theater.isotope('reloadItems');
    secondIsotope();
  }

  function getElements(news, contents){
    var elements   = [];
    for(var i = 0; i < news.length; i++){
      var index    = _.findIndex(contents, function(con){return con._id === news[i];});
      var $newSix  = $('<h6 class="hidden old ' + contents[index]._id + '">' + contents[index]._id + '</h6>');
      var newItem = makeItem(contents[index]);
      elements.push($newSix);
      elements.push(newItem);
    }
    return elements;
  }

  function makeItem(content){
    var item;
    if(content.network === 'twitter'){
      if(content.type === null){
        item = '<div class="item twitter text ' + content._id + '">' +
        '<div class="social">' +
        '<i class="fa fa-twitter"></i>' +
        '</div>' +
        '<div class="content">' +
        '</div>' +
        '<div class="info-container">' +
        '<div class="user-img">' +
        '<img src="' + content.profilePic + '">' +
        '</div>' +
        '<div class="info">' +
        '<span class="user">' + content.name + '</span>' +
        '<p class="caption">' + content.caption + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';
        return item;
      }
      if(content.type === 'photo' || content.type === 'video'){
        item = '<div class="item twitter img ' + content._id + '">' +
        '<div class="social">' +
        '<i class="fa fa-twitter"></i>' +
        '</div>' +
        '<div class="content">' +
        '<img src="' + content.mediaUrl + '">' +
        '</div>' +
        '<div class="info-container">' +
        '<div class="user-img">' +
        '<img src="' + content.profilePic + '">' +
        '</div>' +
        '<div class="info">' +
        '<span class="user">' + content.name + '</span>' +
        '<p class="caption">' + content.caption + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';
        return item;
      }
    }
    if(content.network === 'instagram'){
      if(content.type === 'image' || content.type === 'video'){
        item = '<div class="item instagram img ' + content._id + '">' +
        '<div class="social">' +
        '<i class="fa fa-instagram"></i>' +
        '</div>' +
        '<div class="content">' +
        '<img src="' + content.image + '">' +
        '</div>' +
        '<div class="info-container">' +
        '<div class="user-img">' +
        '<img src="' + content.profilePic + '">' +
        '</div>' +
        '<div class="info">' +
        '<span class="user">' + content.name + '</span>' +
        '<p class="caption">' + content.caption + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';
        return item;
      }
    }
  }


  function init() {

    var obj = $('#three .item');
    var items = $.makeArray( obj );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 0, 1000);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0,0,0));


    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

    // items

    for ( var i = 0; i < items.length; i ++ ) {

      // Push initial random positioning of items

      var object = new THREE.CSS3DObject( items[i] );
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;

      scene.add( object );

      objects.push( object );


      // Push into an array the isotope positioning of items

      var iso = $('#theater .item');
      var isos = $.makeArray( iso );

      var object = new THREE.Object3D();

      var heights = $('#theater .item').eq(i).height();
      var coords = (isos[i].style.transform.split("(")[1].split(",") );

      object.position.x = (coords[0].split("px"))[0] - objOffx;
      object.position.y = (coords[1].split("px"))[0] - objOffy;
      object.position.z = i % 6 * 20;

      targets.items.push( object );

    }

    transform( targets.items, 2000 );

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    document.getElementById( 'three' ).appendChild( renderer.domElement );


    // Orbit Controls
    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function updateObjects() {

    var newitems = [];
    var targets = { items: [], newitems: [] };
    var isos = [];

    var iso = $('#theater .item');
    var isos = $.makeArray( iso );

    for ( var i = 0; i < items.length; i ++ ) {

      var object = new THREE.Object3D();

      var heights = $('#theater .item').eq(i).height();
      var coords = (isos[i].style.transform.split("(")[1].split(",") );

      object.position.x = (coords[0].split("px"))[0] - objOffx;
      object.position.y = (coords[1].split("px"))[0] - objOffy;
      object.position.z = i % 6 * 30;

      targets.newitems.push( object );

    }

    transform( targets.newitems, 2000 );

  }

  function transform( targets, duration ) {

    TWEEN.removeAll();

    for ( var i = 0; i < objects.length; i ++ ) {

      var object = objects[ i ];
      var target = targets[ i ];

      new TWEEN.Tween( object.position )
      .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

      new TWEEN.Tween( object.rotation )
      .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

    }

    new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

  }


  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

  }

  function animate() {

    requestAnimationFrame( animate );
    TWEEN.update();
    controls.update();

  }

  function render() {

    renderer.render( scene, camera );

  }


  function loaded() {

    $('inst1').addClass('animated bounceInLeft');

    var engager = zig.EngageUsersWithSkeleton(1);

    engager.addEventListener('userengaged', function(user) {
      console.log('User engaged: ' + user.id);
      //console.clear();
      //TWEEN.removeAll();
      //console.log('Head position: ' + user.skeleton[zig.Joint.Head].position);

      var pos = user.skeleton[zig.Joint.Head].position;
      var thex = (-pos[0]) * 0.5;
      var thez = (pos[2]) * 0.2;

      setInterval(function() {
        var theDiv = window.getComputedStyle($('#three div div').get(0));
        var matrix = new WebKitCSSMatrix(theDiv.webkitTransform);
        panObj = matrix.m41;
      }, 1000);

      setInterval(function(){
        user.addEventListener('userupdate', function(user) {
          var pos = user.skeleton[zig.Joint.Head].position;
          var thex = (-pos[0]) * 0.4;
          var thez = (pos[2]) * 0.2;
          var thepan = (-pos[0]) * 0.0001;
          camera.position.z = thez;
          //var panObj = $('#three div div').css('transform').split('(')[1].split(',')[12];
          //if ( (panObj  < maxLeft) && (panObj > maxRight) ) {
          controls.panLeft(thepan);
          //}
          console.log(thepan);
        });
      }, 10);

    });

    engager.addEventListener('userdisengaged', function(user) {
      console.log('User disengaged: ' + user.id);
      console.clear();
    });
    zig.addListener(engager);
  }

})();
