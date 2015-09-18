(function(){
  'use strict';

  var $theater, oldArray, newArray;

  function initialize(){
    initIsotope();
    $('.collSelect').select2({
      placeholder: "Filter By Collection",
      allowClear: true
    });
    $('.displaySelect').select2({
      placeholder: "Filter By Display",
      allowClear: true
    });
    $('.creTog').click(remove);
    // setInterval(function(){pullNewContent();}, 10000);
  }

  function initIsotope(){
    $theater = $('#theater').imagesLoaded(function(){
      $('#theater').isotope({
        itemSelector : '.item'
      });
      var imgs = $('#theater').find('img');
      console.log(imgs.length);
    });
  }

  function remove(){
    var that = $(this).closest('.item');
    var idee = that[0].classList[3];
    console.log(this.classList);
    $('h6').remove("." + idee);
    if(this.classList.contains('creTog')){
      console.log("REMOVE HIT YO!!!");
      $theater.isotope( 'remove', that, function(){});
      initIsotope();
    }
  }

  function pullNewContent(){
    getSixes();
    var attr = document.getElementById('thiscoll').options[0].getAttribute('value');
    var url = window.location.origin.replace(/[0-9]{4}/, '3000') + '/moderate/' + attr;
    $.getJSON(url, makeNewArray);
  }

  function getSixes(){
    oldArray  = [];
    var sixes = $('#theater').find('h6');
    var items = $('#theater').find('.item');
    console.log("SIXES: " + sixes.length);
    console.log("ITEMS: " + items.length);
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
    console.log(news);
    if(news !== []){
      appendNews(news, contents);
    }
  }

  function appendNews(news, contents){
    var elements = getElements(news, contents);
    $theater.append(elements);
    $theater.isotope('reloadItems');
    initIsotope();
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
        item = '<div class="item twitter text ' + content._id + ' twitmod">' +
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
'<div class="row modForm">' +
'<div class="col-xs-6">' +
'<form method="post" action="/moderateYes" enctype="multipart/form-data">' +
'<input type="text" name="_id" class="hidden" value="<%= content._id %>">' +
'<input type="text" name="tag" class="hidden" value="<%= collect._id %>">' +
'<button type="submit" class="btn btn-primary creTog">' +
'<h2>YES</h2>' +
'</button>' +
'</form>' +
'</div>' +
'<div class="col-xs-6">' +
'<form method="post" action="/moderateNo" enctype="multipart/form-data">' +
'<input type="text" name="_id" class="hidden" value="<%= content._id %>">' +
'<input type="text" name="tag" class="hidden" value="<%= collect._id %>">' +
'<button type="submit" class="btn btn-danger creTog">' +
'<h2>NO</h2>' +
'</button>' +
'</form>' +
'</div>' +
'</div>' +
'</div>';
        return item;
      }
      if(content.type === 'photo' || content.type === 'video'){
        item = '<div class="item twitter img ' + content._id + ' twitmodmed">' +
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
'<div class="row modForm">' +
'<div class="col-xs-6">' +
'<form method="post" action="/moderateYes" enctype="multipart/form-data">' +
'<input type="text" name="_id" class="hidden" value="<%= content._id %>">' +
'<input type="text" name="tag" class="hidden" value="<%= collect._id %>">' +
'<button type="submit" class="btn btn-primary creTog">' +
'<h2>YES</h2>' +
'</button>' +
'</form>' +
'</div>' +
'<div class="col-xs-6">' +
'<form method="post" action="/moderateNo" enctype="multipart/form-data">' +
'<input type="text" name="_id" class="hidden" value="<%= content._id %>">' +
'<input type="text" name="tag" class="hidden" value="<%= collect._id %>">' +
'<button type="submit" class="btn btn-danger creTog">' +
'<h2>NO</h2>' +
'</button>' +
'</form>' +
'</div>' +
'</div>' +
'</div>';
        return item;
      }
    }
    if(content.network === 'instagram'){
      if(content.type === 'image' || content.type === 'video'){
        item = '<div class="item instagram img ' + content._id + ' instamod">' +
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
'<div class="row modForm">' +
'<div class="col-xs-6">' +
'<form method="post" action="/moderateYes" enctype="multipart/form-data">' +
'<input type="text" name="_id" class="hidden" value="<%= content._id %>">' +
'<input type="text" name="tag" class="hidden" value="<%= collect._id %>">' +
'<button type="submit" class="btn btn-primary creTog">' +
'<h2>YES</h2>' +
'</button>' +
'</form>' +
'</div>' +
'<div class="col-xs-6">' +
'<form method="post" action="/moderateNo" enctype="multipart/form-data">' +
'<input type="text" name="_id" class="hidden" value="<%= content._id %>">' +
'<input type="text" name="tag" class="hidden" value="<%= collect._id %>">' +
'<button type="submit" class="btn btn-danger creTog">' +
'<h2>NO</h2>' +
'</button>' +
'</form>' +
'</div>' +
'</div>' +
'</div>';
        return item;
      }
    }
  }

  $(document).ready(initialize);


  // $('.isotope').isotope({
  //   itemSelector: '.item'
  // });
  //
  // var camera, scene, renderer;
  // var controls;
  // var material = new THREE.MeshBasicMaterial({ wireframe: true });
  // var geometry = new THREE.PlaneGeometry();
  // var planeMesh= new THREE.Mesh( geometry, material );
  //
  // init();
  // animate();
  //
  // function init() {
  //   camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  //   camera.position.z = 3000;
  //   scene = new THREE.Scene();
  //   glScene.add(planeMesh);
  //   renderer = new THREE.CSS3DRenderer();
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  //   renderer.domElement.style.position = 'absolute';
  //   //document.getElementById( 'container' ).appendChild( renderer.domElement );
  //   controls = new THREE.TrackballControls( camera, renderer.domElement );
  //   controls.rotateSpeed = 0.5;
  //   controls.minDistance = 500;
  //   controls.maxDistance = 6000;
  //   controls.addEventListener( 'change', render );
  //   window.addEventListener( 'resize', onWindowResize, false );
  // }
  //
  // function onWindowResize() {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  //   render();
  // }
  //
  // function animate() {
  //   requestAnimationFrame( animate );
  //   controls.update();
  // }
  //
  // function render() {
  //   renderer.render( scene, camera );
  // }





})();
