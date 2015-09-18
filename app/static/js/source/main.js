(function(){
  'use strict';

  var $theater, oldArray, newArray;

  function initialize(){
    //initIsotope();
    disconnect();
    $('.collSelect').select2({
      placeholder: "Choose Collections",
      width: '100%',
      allowClear: true
    });
    $('.collSelect2').select2({
      width: '100%',
      allowClear: true
    });
    $('.editbut').click(editForm);
    $('.cancelbut').click(cancelEdit);
    $('#createtoggle').click(toggleCreateForm);
    //setInterval(function(){pullNewContent();}, 10000);
  }

  function initIsotope(){
    $theater = $('#theater').imagesLoaded(function(){
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
    var url = window.location.origin.replace(/[0-9]{4}/, '3000') + '/kindex';
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
