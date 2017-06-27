'use strict';

var express = require("express");

var lockedAdminRoutes = express.Router();

var Page = require("../models/page").Page;
var Available = require("../models/available").Available;
var User = require("../models/user").User;
//var Upcoming = require("../models/user").Upcoming;
var mid = require('../middleware');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


// lockedAdminRoutes.param("page", function(req, res, next, id){
//   User.find({pageID: id}, function(err, user){
//     //console.log(available);
//     if(!user){
//       var err = new Error("No Users");
//       next(err);
//     }
//     else if (err){
//       var err = new Error("Not Found");
//       next(err);
//     }
//     req.users = user.map(function(u){
//       return {
//         billing: u.billing,
//         email: u.email,
//         upcoming: u.upcoming
//       }
//     });
//     return next();
//   });
// });


lockedAdminRoutes.param("pageID", function(req, res, next, id){
  Page.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.page = doc;
    return next();
  });
});


lockedAdminRoutes.param("section", function(req,res,next,id){
  req.section = req.page[id];
  if(!req.section){
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});



lockedAdminRoutes.param("sectionID", function(req, res, next, id){
  req.oneSection = req.section.id(id);
  if(!req.oneSection){
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

lockedAdminRoutes.param("upcomingSection", function(req,res,next,id){
  //upcomings
  if(req.section.length > 0){
    var upcoming = [];
    var counter = 0;
    req.section.forEach(function(s, index){
      User.findById(s, function(err, user){
        if(err) return next(err);

        //remove user's upcoming that are out of date
        if(user.upcoming.depart < new Date()){
          //if user has no upcoming, remove id from page
          counter++;
        }
        else {
          upcoming.push(user.upcoming);
          counter++;
        }

        if(req.section.length === counter){
          //user id that have wrong dates
          var flatten = upcoming.reduce(function(a, b){
            return a.concat(b);
          }, []);

          //don't bother returning upcoming that does not contain month
          // flatten.forEach(function(f){
          //
          // });
          req.upcoming = flatten;
          return next();
        }
      });
    });
  }
  else {
    req.upcoming = [];
  }

});



//=======================GET USER INFO===========================
//get all users
// lockedAdminRoutes.get("/:pageID/:page/users", mid.authorizeAdmin, function(req, res){
//   res.json(req.users)
// });

//======================EDIT SECTIONS==============================
lockedAdminRoutes.get("/:pageID/:section", mid.authorizeAdmin, function(req, res){
  res.json(req.section);
});

//add section
lockedAdminRoutes.post("/:pageID/:section", mid.authorizeAdmin, function(req, res, next){

  req.section.push(req.body);
  req.page.save(function(err, page){
    if(err) return next(err);
    res.status(201);

    if(req.params.section === "rooms"){ //update available if change in rooms
      Available.find({pageID: req.params.pageID}, function(err, available){
        //console.log(available);
        if(!available || err){
          var err = new Error("Not Found");
          next(err);
        }
        available.forEach(function(a, index){
          a.free.push({roomID:page._id});
          a.save(function(err, newA){
            if(err) next(err);
            else if (index === available.length - 1) res.json({page:page, available:available});
          });
        });
      });
    }
    else {
      res.json(page[req.params.section]);
    }
  });
});


lockedAdminRoutes.get("/:pageID/:section/:sectionID", mid.authorizeAdmin, function(req, res){
  res.json(req.oneSection);
});

//edit section
lockedAdminRoutes.put("/:pageID/:section/:sectionID", mid.authorizeAdmin, function(req, res){
  Object.assign(req.oneSection, req.body);
  req.page.save(function(err, result){
    if(err){
      return next(err);
    }
    res.json(result[req.params.section]);
  });
});


//delete section
lockedAdminRoutes.delete("/:pageID/:section/:sectionID", mid.authorizeAdmin, function(req, res){
  req.oneSection.remove(function(err){
    req.page.save(function(err, page){
      if(err) return next(err);
      if(req.params.section === "rooms"){ //update available if change in rooms
        Available.find({pageID: req.params.pageID}, function(err, available){
          //console.log(available);
          if(!available){
            var err = new Error("Not Found");
            next(err);
          }
          available.forEach(function(a, index){
            var filtered = a.free.filter(function(item){
              return item.roomID !== req.params.sectionID;
            });
            filtered.save(function(err, newA){
              if(err) next(err);
              else if (index === available.length - 1) res.json({page:page, available:available});
            });
          });
        });
      }
      else {
        res.json(page[req.params.section]);
      }

    })
  })
});

//================EDIT USER'S UPCOMING=====================================================
//get upcoming for month
lockedAdminRoutes.get("/:pageID/:section/upcoming/:upcomingSection/", mid.authorizeAdmin, function(req, res){
  res.json(req.upcoming);
});



module.exports = lockedAdminRoutes;
