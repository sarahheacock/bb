'use strict';

var bcrypt = require("bcrypt");
var express = require("express");
var lockedUserRoutes = express.Router();
var User = require("../models/user").User;
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
    return next();
  });
})


lockedUserRoutes.param("upcomingID", function(req,res,next,id){
  req.upcoming = req.user.upcoming.id(id);
  if(!req.upcoming){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//============================================================
//get user info
lockedUserRoutes.get('/:userID', mid.authorizeUser, function(req, res, next){
  res.json(req.user);
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
    res.json(user);
  })
});


//make new reservation
//(1) update user upcoming
//(2) update page upcoming array
//(3) update available
lockedUserRoutes.post("/:userID/upcoming", mid.authorizeUser, function(req, res, next){

    var upcoming = req.body;
    upcoming.userEmail = req.user.email;
    req.user.upcoming.push(upcoming);
    req.user.save(function(err, user){
      if(err) return next(err);
      res.status(201);
      req.newUser = user;
      next();
    });

  },
  function(req, res, next){
    //save upcoming into page array
    Page.findById(req.user.pageID, function(err, doc){
      if(err) next(err);
      //find month
      //push into appropiate month
      var arriveMonth = new Date(parseInt(req.body.arrive)).getMonth();
      var departMonth = new Date(parseInt(req.body.depart)).getMonth();

      if(arriveMonth !== departMonth && !doc[departMonth].includes(req.user._id)) doc[departMonth].push(req.user._id);
      if(!doc[arriveMonth].includes(req.user._id)) doc[arriveMonth].push(req.user._id);

      doc.save(function(err){
        if(err) return next(err);
        next();
      });
      //next();
    });
  },
  function(req, res, next){
    var end = parseInt(req.body.depart);
    var begin = parseInt(req.body.arrive);
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
          if(d.roomID.equals(req.body.room)){
            d.update('reserve', function(err, updated){
              if(err) return next(err);
              if(dateArr.length === index + 1) res.json(req.newUser);
            });
          }
        });

      });
    });

  }
);



lockedUserRoutes.get("/:userID/upcoming/:upcomingID", mid.authorizeUser, function(req, res){
  res.json(req.upcoming);
});

//cancel reservation
//(1) update page upcoming
//(2) update available
//(3) update user upcoming
lockedUserRoutes.delete("/:userID/upcoming/:upcomingID", mid.authorizeUser, function(req, res, next){
  //save upcoming into page array
  Page.findById(req.user.pageID, function(err, doc){
    if(err) next(err);

    //find month
    //push into appropiate month
    var arriveMonth = new Date(parseInt(req.upcoming.arrive)).getMonth();
    var departMonth = new Date(parseInt(req.upcoming.depart)).getMonth();


    if(arriveMonth !== departMonth){
      var departIndex = doc[departMonth].indexOf(req.user._id);
      if(departIndex !== -1 && req.user.upcoming.length === 1) doc[departMonth].splice(departIndex, 1);
    }

    var arriveIndex = doc[arriveMonth].indexOf(req.user._id);
    if(arriveIndex !== -1 && req.user.upcoming.length === 1) doc[arriveMonth].splice(arriveIndex, 1);


    doc.save(function(err){
      if(err) return next(err);
      next();
    });

  });
},
function(req, res, next){
  var end = parseInt(req.upcoming.depart);
  var begin = parseInt(req.upcoming.arrive);
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
        if(d.roomID.equals(req.upcoming.room)){
          d.update('cancel', function(err, updated){
            if(err) return next(err);
            if(dateArr.length === index + 1) {

              req.upcoming.remove(function(err){
                if(err) return next(err);
                req.user.save(function(err, user){
                  if(err) return next(err);
                  res.json(user);
                });
              });

            }
          });
        }
      });

    });
  })
});




module.exports = lockedUserRoutes;
