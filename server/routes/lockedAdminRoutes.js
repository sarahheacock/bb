//'use strict';

var express = require("express");
var ObjectId = require('mongodb').ObjectID;
var lockedAdminRoutes = express.Router();

var Page = require("../models/page").Page;
var Available = require("../models/available").Available;
//var User = require("../models/user").User;
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

lockedAdminRoutes.param("request", function(req,res,next,id){
  //REQUEST OPTIONS===========================================
  if(id === "all"){
    //request for all upcoming
    var parameters = {"event.pageID": req.params.pageID};
  }
  else if(parseInt(id) >= 0 && parseInt(id) <= 11){
    //if request is for a month
    var ID = parseInt(id);
    var orArr = [ID - 1, ID, ID + 1].map(function(i){
      if(i < 0) return {month: 11};
      else if (i > 11) return {month: 0};
      else return {month: i};
    });

    var parameters = {
      "event.pageID": req.params.pageID, //HAVE NOT TESTED PAGEID!
      $or: orArr
    };
  }
  else { //request is a upcomingID
    var parameters = {_id: id};
  }
  //===============================================================

  Upcoming.find(parameters, function(err, upcoming){
    if(err) return next(err);
    if(!upcoming){
      var err = new Error("Upcoming Not Found");
      err.status = 404;
      return next(err);
    }
    var result = upcoming.map(function(u){
      var roomTitle = req.page.rooms.id(u.event.roomID).title;
      var roomImage = req.page.rooms.id(u.event.roomID).image;
      return {
        start: u.start,
        end: u.end,
        title: u.title,
        month: u.month,
        event: {
          guests: u.event.guests,
          roomID: {
            title: roomTitle,
            image: roomImage
          },
          userID: u.event.userID,
          pageID: u.event.pageID,
          paid: u.event.paid,
          checkedIn: u.event.checkedIn,
          notes: u.event.notes,
          createdAt: u.event.createdAt,
        }
      };
    });
    req.upcoming = result;
    next();
  });

});

//create upcoming
lockedAdminRoutes.post("/:pageID/", mid.authorizeAdmin, function(req, res, next){
    var upcoming = new Upcoming(req.body);
    upcoming.event.pageID = req.params.pageID;
    upcoming.month = new Date(parseInt(req.body.start)).getMonth();

    upcoming.save(function(err, up){
      if(err) return next(err);
      req.newUpcoming = up;
      next();
    });
  },
  function(req, res, next){ // update what is available
    var end = parseInt(req.body.end) - (24*60*60*1000);
    var begin = parseInt(req.body.start);
    var dateArr = [];
    var results = [];

    while(end >= begin){
      dateArr.push(new Date(end));
      end = end - (24*60*60*1000);
    }

    if(end < begin){
      //console.log(date)
      dateArr.forEach(function(thisDate, index){
        Available.findOne({ pageID: req.params.pageID, date: thisDate }, function(err, date){

          if(err || !date) return next(err);
          date.free.forEach(function(d, index){
            if(d.roomID.equals(req.body.event.roomID)){
              d.update('reserve', function(err, updated){
                if(err) return next(err);
                if(dateArr.length === index + 1) res.json(req.newUpcoming);
              });
            }
            else if(dateArr.length === index + 1) {
              res.json(req.newUpcoming);
            }
          });

        });
      });
    }

  });
//});

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

//================EDIT UPCOMING=====================================================
//request === all or monthNum or ID
lockedAdminRoutes.get("/:pageID/rooms/upcoming/:request", mid.authorizeAdmin, function(req, res){
  //console.log();
  // if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
  //   var room = req.page.rooms.id(req.upcoming[0].event.roomID);
  //   var minRoom = {
  //     title: room.title,
  //     image: room.image
  //   }
  //   if(room){
  //     if(room.title){
  //       res.json([{upcoming: req.upcoming[0], room: minRoom}]);
  //     }
  //   }
  //   res.json(req.upcoming);
  // }
  res.json(req.upcoming);


});

//edit one upcoming
lockedAdminRoutes.put("/:pageID/rooms/upcoming/:request", mid.authorizeAdmin, function(req, res){
  if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
    Object.assign(req.upcoming[0], req.body);
    req.upcoming[0].save(function(err, result){
      if(err) return next(err);
      res.json(result);
    });
  }
  else {
    next(err);
  }
});

//delete one upcoming
lockedAdminRoutes.delete("/:pageID/rooms/upcoming/:request", mid.authorizeAdmin, function(req, res, next){ // update what is available
  var end = parseInt(req.upcoming[0].end) - (24*60*60*1000);
  var begin = parseInt(req.upcoming[0].start);
  var dateArr = [];
  var results = [];

  while(end >= begin){
    dateArr.push(new Date(end));
    end = end - (24*60*60*1000);
  }

  if(end < begin){
    dateArr.forEach(function(thisDate, index){
      //console.log(dateArr);
      Available.findOne({ pageID: req.params.pageID, date: thisDate }, function(err, date){

        if(err) return next(err);
        if(!date){
          err = new error("Unavailable date");
          return next(err);
        }

        date.free.forEach(function(d){
          if(d.roomID.equals(req.upcoming[0].event.roomID)){
            d.update('cancel', function(err, updated){
              if(err) return next(err);
              else if(dateArr.length === index + 1) next();
            });
          }
          else if(dateArr.length === index + 1) {
            next();
          }
        });
      });
    });
  }
},
function(req, res, next){
  if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
    req.upcoming[0].remove(function(err){
      if(err) return next(err);
      Upcoming.find({"event.pageID": req.params.pageID}, function(err, up){
        if(err || !up) res.json([]);
        res.json(up);
        //req.newUpcoming = up;
        //next();
      })
    })
  }
});


module.exports = lockedAdminRoutes;
