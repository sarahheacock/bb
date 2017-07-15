'use strict';

var express = require("express");
var ObjectId = require('mongodb').ObjectID;
var lockedUserRoutes = express.Router();

var Page = require("../models/page").Page;
var Available = require("../models/available").Available;
var User = require("../models/user").User;
var Upcoming = require("../models/user").Upcoming;
var mid = require('../middleware');



lockedUserRoutes.param("userID", function(req, res, next, id){
  User.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.user = doc;
    Page.findById(req.user.pageID, function(err, doc){
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
});

//===========================================================
lockedUserRoutes.param("request", function(req,res,next,id){
  //REQUEST OPTIONS===========================================
  if(id === "all"){
    //request for all upcoming
    var parameters = {"event.userID": req.params.userID};
  }
  else { //request is a upcomingID
    var parameters = {_id: id};
  }
  //===============================================================

  Upcoming.find(parameters, function(err, upcoming){
    if(err) return next(err);
    if(!upcoming){
      if(id === "all"){
        req.upcoming = [];
        return next();
      }
      var err = new Error("Upcoming Not Found");
      err.status = 404;
      return next(err);
    }
    req.upcoming = upcoming;
    next();
  });
});

//this is to format upcoming output
function formatOutput(req, res){
  if(req.upcoming.length > 0){
    var result = req.upcoming.map(function(u){
      var roomTitle = req.page.rooms.id(u.event.roomID).title;
      var roomImage = req.page.rooms.id(u.event.roomID).image;
      return {
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
      };
    });
    //res.json(result);
    return [{
      _id: req.user._id,
      email: req.user.email,
      billing: req.user.billing,
      credit: req.user.credit,
      upcoming: result
    }];
  }
  //res.json([]);
  return [{
    _id: req.user._id,
    email: req.user.email,
    billing: req.user.billing,
    credit: req.user.credit,
    upcoming: []
  }];
}

function formatUser(req, res){
  var username = req.user.email.split("@");
  var billArr = req.user.billing.split('/');
  var d = new Date();

  var billObj = {};
  ["Address Line 1", "Address Line 2", "city", "state", "zip", "country"].forEach(function(add, i){
    billObj[add] = billArr[i]
  });

  return {
    billing: {
      email: req.user.email,
      name: username[0],
      address: billObj
    },
    payment: {
      "Name on Card": req.user.credit.name,
      number: req.user.credit.number,
    }
  };
}
//================GET AND EDIT USER=====================================================
lockedUserRoutes.get("/:userID", mid.authorizeUser, function(req, res, next){
  res.json(formatUser(req, res));
});

//edit user info
lockedUserRoutes.put('/:userID/', mid.authorizeUser, function(req, res, next){
  if(req.body.payment){
    req.user.email = req.body.payment.email;
    req.user.credit = {
      name: req.body.payment["Name on Card"],
      number: req.body.payment["number"],
    }
  }
  if(req.body.billing){
    var billing = req.body.billing;
    var billString = Object.keys(billing.address).map(function(b){
      return billing.address[b];
    }).join('/');
    req.user.billing = billString;
    req.user.email = billing.email;
  }

  req.user.save(function(err, user){
    if(err) return next(err);
    res.status(200);
    res.json(formatUser(req, res));
    //res.json(req.user);
  })
});

//create upcoming
lockedUserRoutes.post("/:userID", mid.authorizeUser, function(req, res, next){
    var upcoming = new Upcoming(req.body);
    upcoming.title = req.user.email;
    upcoming.event.pageID = req.user.pageID;
    upcoming.event.userID = req.user._id;
    upcoming.month = new Date(parseInt(req.body.start)).getMonth();

    upcoming.save(function(err, up){
      if(err) return next(err);
      req.start = req.body.start;
      req.end = req.body.end;
      req.roomID = req.body.event.roomID;
      req.dir = true;
      //req.upcoming.push(up);
      next();
    });
  },
  function(req, res, next){ // update what is available
    Available.updateDates(req, function(err, updated){
      if(err) return next(err);
      //res.json(formatOutput(req, res));
      res.json({"message": "success"});
    });

  });

//request === all or monthNum or ID
lockedUserRoutes.get("/:userID/:request", mid.authorizeUser, function(req, res){
  res.json(formatOutput(req, res));
});

//edit one upcoming
// lockedUserRoutes.put("/:userID/:request", mid.authorizeUser, function(req, res){
//
//   if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
//     Object.assign(req.upcoming[0], req.body);
//     req.upcoming[0].save(function(err, result){
//       if(err) return next(err);
//       req.upcoming = [result];
//       res.json(formatOutput(req, res));
//     });
//   }
//   else {
//     var err = new Error("Invalid request");
//     return next(err);
//   }
// });




//CANCEL RESERVATION
lockedUserRoutes.delete("/:userID/:request", mid.authorizeUser, function(req, res, next){ // update what is available
  if(req.params.request !== "all"){

    req.end = parseInt(req.upcoming[0].end);
    req.start = parseInt(req.upcoming[0].start);
    req.roomID = req.upcoming[0].event.roomID;
    req.dir = false;

    var parameters = {
      "event.userID": req.user._id,
    };

    Available.updateDates(req, function(err, updated){

      if(err) return next(err);
      req.upcoming[0].remove(function(err){
        if(err) return next(err);
        Upcoming.find(parameters, function(err, up){
          if(err || !up) res.json({});
          req.upcoming = up;
          res.json(formatOutput(req, res));
        });
      });

    });
  }
});



module.exports = lockedUserRoutes;
