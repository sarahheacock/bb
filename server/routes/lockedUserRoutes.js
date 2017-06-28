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
              if(index + 1 === end) {
                return next();
              }
            });
          }
          else if(index + 1 === end) {
            return next();
          }
        });
      });
    }
    else {
      return next();
    }
    //req.user = doc;

  });
})


lockedUserRoutes.param("upcomingID", function(req,res,next,id){
  Upcoming.findById(id, function(err, upcoming){
    if(err) return next(err);
    if(!upcoming){
      err = new Error("Upcoming Not Found");
      err.status = 404;
      return next(err);
    }

    req.upcoming = upcoming;
    return next();
  });
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

lockedUserRoutes.get('/:userID/detail', mid.authorizeUser, function(req, res, next){
  Page.findById(req.user.pageID, function(err, page){
    if(err) return next(err);
    if(!page){
      err = new Error("Page Not Found");
      err.status = 404;
      return next(err);
    }

    if(req.user.upcoming.length > 0){
      var detail = [];

      req.user.upcoming.forEach(function(up){
        Upcoming.findById(up, function(err, u){
          if(err) return next(err);
          if(!u){
            err = new Error("Upcoming Not Found");
            err.status = 404;
            return next(err);
          }

          detail.push({when: u, where: page.rooms.id(u.room)});

          if(detail.length === req.user.upcoming.length){
            //req.user.upcoming = detail;
            res.json({user: req.user, upcomingDetail: detail});
          }
        });
      });

    }
    else {
      res.json(req.user);
    }
  });

});


// MAKE NEW RESERVATION
//(1) update user upcoming
//(2) update page upcoming array
//(3) update available
lockedUserRoutes.post("/:userID/upcoming", mid.authorizeUser, function(req, res, next){
  // create new upcoming and add id to user
    var upcoming = new Upcoming(req.body);
    upcoming.userEmail = req.user.email;
    upcoming.user = req.user._id;

    upcoming.save(function(err, up){
      if(err) return next(err);
      req.user.upcoming.push(up._id);
      req.newUpcoming = up._id;

      req.user.save(function(err, user){
        if(err) return next(err);
        res.status(201);
        req.newUser = user;
        next();
      });

    });
  },
  function(req, res, next){ // save upcoming into page array

    Page.findById(req.user.pageID, function(err, doc){
      if(err) next(err);
      //find month
      //push into appropiate month
      var arriveMonth = new Date(parseInt(req.body.arrive)).getMonth();
      //var departMonth = new Date(parseInt(req.body.depart)).getMonth();

      //if(arriveMonth !== departMonth && !doc[departMonth].includes(req.newUpcoming)) doc[departMonth].push(req.newUpcoming);
      if(!doc[arriveMonth].includes(req.newUpcoming)) doc[arriveMonth].push(req.newUpcoming);

      doc.save(function(err){
        if(err) return next(err);
        next();
      });

    });
  },
  function(req, res, next){ // update what is available
    var end = parseInt(req.body.depart) - (24*60*60*1000);
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


    //MAKE SURE THIS WORKS!!============================================
    // if(arriveMonth !== departMonth){
    //   var departIndex = doc[departMonth].indexOf(req.upcoming._id);
    //   if(departIndex !== -1) doc[departMonth].splice(departIndex, 1);
    // }

    var arriveIndex = doc[arriveMonth].indexOf(req.upcoming._id);
    if(arriveIndex !== -1) doc[arriveMonth].splice(arriveIndex, 1);
    //===================================================================

    doc.save(function(err){
      if(err) return next(err);
      next();
    });

  });
},
function(req, res, next){ // update what is available
  var end = parseInt(req.upcoming.depart) - (24*60*60*1000);
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
              // update user upcoming====================
              // req.upcoming.remove(function(err){
              //   if(err) return next(err);
              //
              // });

              var oldIndex = req.user.upcoming.indexOf(req.upcoming._id);
              if(oldIndex !== -1) req.user.upcoming.splice(oldIndex, 1);
              req.user.save(function(err, user){
                if(err) return next(err);

                req.upcoming.remove(function(err){
                  if(err) return next(err);
                  res.json(req.user);
                });

              });
              //========================================
            }
          });
        }
      });

    });
  })
});




module.exports = lockedUserRoutes;
