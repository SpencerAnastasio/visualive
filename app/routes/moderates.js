/*jshint -W079 */
'use strict';
var _           = require('lodash');
var FaceContent = require('../models/facecontent.js');
var Collection  = require('../models/collection.js');

exports.moderateShow = function(req, res){
  getCollections(req, function(collections){
    if(collections.length >= 1){
      var collect = collections.shift();
      FaceContent.findByTag(collect.hashtag, function(contains){
        if(contains.length >= 1){
          getNoshows(collect.accepted, collect.rejected, function(noshows){
            if(noshows.length >= 1){
              getCollCon(noshows, contains, function(conte){
                var contents = conte.splice(0, 300);
                res.render('./views/moderate/index.ejs', {collections: collections, collect: collect, contents: contents});
              });
            }else{
              contentToShow(collections, collect, contains, res);
            }
          });
        }else{
          collectionsToShow(collections, collect, res);
        }
      });
    }else{
      nothingToShow(res);
    }
  });
};


function getCollections(req, fn){
  if(req.body.coll === undefined){
    Collection.findByUserId(req.session.userId, function(records){
      fn(records);
    });
  }else{
    console.log("THIS IS THE REQ DOT BODY PART OF THIS THING");
    Collection.findById(req.body.coll, function(collect){
      Collection.findByUserId(req.session.userId, function(records){
        for(var k = 0; k < records.length; k++){
          if(records[k]._id.toString() === req.body.coll){
            records.splice(k, 1);
          }
        }
        records.unshift(collect);
        fn(records);
      });
    });
  }
}

function getNoshows(ca, cr, fn){
  var arr = ca;
  var rra = cr;
  var ray = arr.concat(rra);
  console.log("THIS IS THE NOSHOW ARRAY: ");
  console.log(ray);
  fn(ray);
}

function getCollCon (ns, tains, fn){
  for(var i = 0; i < ns.length; i++){
    for(var j = 0; j < tains.length; j++){
      if(tains[j]._id.toString() === ns[i]){
        tains.splice(j, 1);
        j -= 1;
      }
    }
  }
  fn(tains);
}

function nothingToShow(res){
  var coll = {};
  var contents = [];
  var colls = [];
  res.render('./views/moderate/index.ejs', {collections: colls, collect: coll, contents: contents});
}

function collectionsToShow(colls, coll, res){
  var contents = [];
  res.render('./views/moderate/index.ejs', {collections: colls, collect: coll, contents: contents});
}

function contentToShow(colls, coll, con, res){
  var contents = con.splice(0, 300);
  res.render('./views/moderate/index.ejs', {collections: colls, collect: coll, contents: contents});
}

exports.yes = function(req, res){
  console.log("YES THIS IS HITTING");
  Collection.findById(req.body.tag, function(collect){
    collect.accepted.push(req.body._id);
    var collection = new Collection(req.session.userId, collect);
    collection.updateAccepted(collection._id.toString(), function(count){
      console.log("YES THIS IS FINISHING");
      res.send(204);
    });
  });
};

exports.no = function(req, res){
  console.log("YES THIS IS HITTING");
  Collection.findById(req.body.tag, function(collect){
    collect.rejected.push(req.body._id);
    var collection = new Collection(req.session.userId, collect);
    collection.updateRejected(collection._id.toString(), function(count){
      console.log("YES THIS IS FINISHING");
      res.send(204);
    });
  });
};

// exports.new = function(req, res){
//   Collection.findById(req.params.id, function(collect){
//     FaceContent.findByTag(collect.hashtag, function(contented){
//       var contents;
//       var arr = collect.accepted;
//       var rra = collect.rejected;
//       var ray = arr.concat(rra);
//       if(contented){
//         if(ray.length > 0){
//           for(var i = 0; i < contented.length; i++){
//             for(var j = 0; j < ray.length; j++){
//               if(contented[i]._id.toString() === ray[j]){
//                 contented.splice(i, 1);
//                 i -= 1;
//               }
//             }
//           }
//           contents = contented.reverse();
//         }else{
//           contents = contented.reverse();
//         }
//         res.send({contents: contents});
//       }else{
//         contents = [];
//         res.send({contents: contents});
//       }
//     });
//   });
// };
