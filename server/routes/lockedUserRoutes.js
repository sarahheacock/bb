'use strict';

var bcrypt = require("bcrypt");
var express = require("express");
var lockedUserRoutes = express.Router();
var User = require("../models/user").User;
var Upcoming = require("../models/user").Upcoming;
var Page = require("../models/page").Page;
var Available = require("../models/available").Available;

var mid = require('../middleware');

lockedUserRoutes.param("userID", function(req, res, next, id){
  User.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("User Not Found");
      err.status = 404;
      return next(err);
    }

    req.user = doc;
    var end = req.user.upcoming.length;
    //THIS IS TO REMOVE NON-EXISTANT UPCOMING
    if(end > 0){
      req.user.upcoming.forEach(function(up, index){
        Upcoming.findById(up, function(err, upcoming){
          if(err) return next(err);

          if(!upcoming){
            var oldIndex = req.user.upcoming.indexOf(up);
            if(oldIndex !== -1) req.user.upcoming.splice(oldIndex, 1);
            //else if (index + 1 === end) return next();

            req.user.save(function(err, user){
              if(err) return next(err);
            });
          }
          if(index + 1 === end) {
            Page.findById(req.user.pageID, function(err, page){

              if(err) return next(err);
              if(!page){
                err = new Error("Page Not Found");
                err.status = 404;
                return next(err);
              }
              req.page = page;
              next();
            });
          }
        });
      });
    }
  });
});


lockedUserRoutes.param("upcomingID", function(req,res,next,id){
  Upcoming.findById(id, function(err, u){
    if(err) return next(err);
    if(!u){
      err = new Error("Upcoming Not Found");
      err.status = 404;
      return next(err);
    }
    req.upcoming = u;
    return next();
  });
});

function getDetails(req, res){
  if(req.upcoming.length > 0){
    var detail = [];

    req.user.upcoming.forEach(function(up){
      Upcoming.findById(up, function(err, u){
        if(err) return next(err);
        if(!u){
          err = new Error("Upcoming Not Found");
          err.status = 404;
          return next(err);
        }

        var roomTitle = req.page.rooms.id(u.event.roomID).title;
        var roomImage = req.page.rooms.id(u.event.roomID).image;

        detail.push({
          _id: u._id,
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
        });

        if(detail.length === req.user.upcoming.length){
          res.json({
            email: req.user.email,
            billing: req.user.billing,
            credit: req.user.credit,
            upcoming: detail
          });
        }
      });
    });
  }
  else {
    res.json({
      email: req.user.email,
      billing: req.user.billing,
      credit: req.user.credit,
      upcoming: []
    })
  }

}

//============================================================
//get user info
// lockedUserRoutes.get('/:userID', mid.authorizeUser, function(req, res, next){
//   res.json(req.user);
// });
lockedUserRoutes.get('/:userID/', mid.authorizeUser, function(req, res, next){
  getDetails(req, res);
});

//edit user info
lockedUserRoutes.put('/:userID', mid.authorizeUser, function(req, res, next){
  if(req.body.email){
    req.user.email = req.body.email;
  }
  if(req.body.billing){
    req.user.billing = req.body.billing;
  }
  if(req.body.credit){
    req.user.credit = req.body.credit;
  }

  req.user.save(function(err, user){
    if(err) return next(err);
    res.status(200);
    getDetails(req, res);
  })
});

// MAKE NEW RESERVATION
//(1) update user upcoming
//(3) update available
lockedUserRoutes.post("/:userID/", mid.authorizeUser, function(req, res, next){
  // create new upcoming and add id to user
    var upcoming = new Upcoming(req.body);
    upcoming.title = req.user.email;
    upcoming.event.pageID = req.user.pageID;
    upcoming.event.userID = req.user._id;
    upcoming.month = new Date(parseInt(req.body.start)).getMonth();

    upcoming.save(function(err, up){
      if(err) return next(err);
      req.user.upcoming.push(up._id);
      //req.newUpcoming = up._id;

      req.user.save(function(err, user){
        if(err) return next(err);
        res.status(201);
        //req.newUser = user;
        next();
      });

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


    dateArr.forEach(function(thisDate, index){
      Available.findOne({ pageID: req.user.pageID, date: thisDate }, function(err, date){

        if(err) return next(err);
        date.free.forEach(function(d){
          if(d.roomID.equals(req.body.event.roomID)){
            d.update('reserve', function(err, updated){
              if(err) return next(err);
              if(dateArr.length === index + 1) getDetails(req, res);
            });
          }
        });

      });
    });
  }
);



lockedUserRoutes.get("/:userID/:upcomingID", mid.authorizeUser, function(req, res){
  res.json(req.upcoming);
});

//cancel reservation
//(2) update available
//(3) update user upcoming
lockedUserRoutes.delete("/:userID/:upcomingID", mid.authorizeUser, function(req, res, next){

  //update user upcoming===================
  var oldIndex = req.user.upcoming.indexOf(req.upcoming._id);
  if(oldIndex !== -1) req.user.upcoming.splice(oldIndex, 1);
  req.user.save(function(err, user){
    if(err) return next(err);
    req.upcoming.remove(function(err){
      if(err) return next(err);
      next();
    });
  });
  //========================================
},
function(req, res, next){ // update what is available
  var end = parseInt(req.upcoming.end) - (24*60*60*1000);
  var begin = parseInt(req.upcoming.start);
  var dateArr = [];
  var results = [];

  while(end >= begin){
    dateArr.push(new Date(end));
    end = end - (24*60*60*1000);
  }

  if(end < begin){
    dateArr.forEach(function(thisDate, index){
      console.log(dateArr);
      Available.findOne({ pageID: req.user.pageID, date: thisDate }, function(err, date){

        if(err) return next(err);
        if(!date){
          err = new error("Unavailable date");
          return next(err);
        }

        date.free.forEach(function(d){
          if(d.roomID.equals(req.upcoming.event.roomID)){
            d.update('cancel', function(err, updated){
              if(err) return next(err);
              if(dateArr.length === index + 1) {
                getDetails(req, res);
              }
            });
          }
        });

      });
    })
  }
});




module.exports = lockedUserRoutes;
