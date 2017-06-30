'use strict';

var express = require("express");
var ObjectId = require('mongodb').ObjectID;
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
  //if(parseInt(id) >= 0 || parseInt(id) <= 11) req.section = [req.page[id - 1], req.page[id], req.page[id + 1]].reduce(function(a, b){ return a.concat(b) }, []);
  //else
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
  var ID = parseInt(id);
  var orArr = [ID - 1, ID, ID + 1].map(function(i){
    if(i < 0) return {month: 11};
    else if (i > 11) return {month: 0};
    else return {month: i};
  });
  //HAVE NOT TESTED PAGEID!
  Upcoming.find({
    "event.pageID": req.params.pageID,
    $or: orArr
  }, function(err, upcoming){
    if(err) return next(err);
    if(!upcoming){
      var err = new Error("Upcoming Not Found");
      err.status = 404;
      return next(err);
    }
    req.upcoming = upcoming;
    next();
  });
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
lockedAdminRoutes.get("/:pageID/rooms/upcoming/:upcomingSection/", mid.authorizeAdmin, function(req, res){
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
