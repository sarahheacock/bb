'use strict';

var express = require("express");

var lockedAdminRoutes = express.Router();

var Page = require("../models/page").Page;
var Available = require("../models/available").Available;
var User = require("../models/user").User;
var Upcoming = require("../models/user").Upcoming;
var mid = require('../middleware');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


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
  var end = req.section.length;
  if(end > 0){
    var up = [];
    // THIS IS TO REMOVE NON-EXISTANT UPCOMING
    req.section.forEach(function(s, index){
      Upcoming.findById(s, function(err, upcoming){
        if(err) return next(err);
        if(!upcoming){
          var oldIndex = req.section.indexOf(upcoming);
          if(oldIndex !== -1) req.section.splice(oldIndex, 1);

          req.section.save(function(err, section){
            if(err) return next(err);
            up.push(section)
          });
        }
        else {
          up.push(upcoming);
        }

        if(end === index + 1){
          // var flatten = upcoming.reduce(function(a, b){
          //   return a.concat(b);
          // }, []);

          req.upcoming = up;
          return next();
        }
      });
    });
  }
  else {
    req.upcoming = [];
    return next();
  }
});


lockedAdminRoutes.param("userID", function(req,res,next,id){
  User.findById(id, function(err, user){
    if(err) return next(err);
    if(!user){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.user = user;
    return next();
  });
});



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

//get user
// lockedAdminRoutes.get("/:pageID/:section/checkin/:userID/", mid.authorizeAdmin, function(req, res){
//   res.json(req.user);
// });
//
// //check-in user
// lockedAdminRoutes.post("/:pageID/:section/checkin/:userID/", mid.authorizeAdmin, function(req, res){
//   //DELETE USER UPCOMING
//   //find the upcoming with date
//   req.user.upcoming.arrive(req.body.arrive);
//
// });


module.exports = lockedAdminRoutes;
