'use strict';

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const temp = new Date().toString().split(' ');
const NOW = new Date(temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3] + " 10:00:00").getTime();


var UpcomingSchema = new Schema({
  start: Number,
  end: Number,
  title: String,
  month: Number,
  event: {
    guests: Number,
    roomID: Schema.Types.ObjectId,
    userID: Schema.Types.ObjectId,
    pageID: Schema.Types.ObjectId,
    paid: {type:String, default:''},
    checkedIn: Date,
    notes: '',
    cost: Number,
    createdAt: {type:Date, default:Date.now},
  },
});


var makeid = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


var UserSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  billing: {
    type: String,
    required: true,
    trim: true
  },
  credit: {
    name: {type: String, default: ''},
    number: {type: String, default: ''},
  },
  userID: {
    type: String,
    default: makeid
  },
  pageID: Schema.Types.ObjectId,
  //upcoming: [UpcomingSchema],
});

// UpcomingSchema.post("save", function(next){
//   var upcoming = this;
//   if(upcoming.event.userID){
//     User.findById(upcoming.event.userID, function(err, user){
//       if(err || !up) return next(err);
//       user.upcoming.push()
//       next();
//     });
//   }
//   next();
// });

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}



UserSchema.pre("save", function(next){
  var user = this;
  if(user.password.length <= 16){
    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;

      next();
    })
  }
  else {
    next();
  }
});

var Upcoming = mongoose.model("Upcoming", UpcomingSchema);
//var UpcomingFile = mongoose.model("UpcomingFile", UpcomingFileSchema);
var User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
  Upcoming: Upcoming
};


//CREATE ANOTHER SCHEMA TO ORGANIZE UPCOMING BY USERID AND MONTH
// var UpcomingFileSchema = new Schema({
//   pageID: Schema.Types.ObjectId,
//   //months
//   system: [],
//   //a trie containing userID with array of upcomingID at the end
//   //first tier to trie contains
//   // months: [
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId],
//   //   [Schema.Types.ObjectId]
//   // ],
//   // users: []
// });

// UpcomingFileSchema.statics("search", function(id, callback){
//   UpcomingFile.findOne({pageID: id.pageID}, function(err, file){
//     if(!file || err) return next(err);
//     if(search.month){
//       var months
//       file.month[search.month].forEach(function(dayID, index){
//
//       });
//     }
//   });
// });

// UpcomingSchema.pre("save", function(next){
//   //find upcomingFile
//   var newU = this;
//   UpcomingFile.find({pageID: newU.event.pageID}, function(err, file){
//     if(err) return next(err);
//     if(!file) {
//       file = new UpcomingFile({pageID: newU.event.pageID});
//     }
//     //save objectID to month
//     var month = file.months[newU.arrive.getMonth()];
//     month.push(newU._id);
//
//     //save objectID to userID
//     if(newU.event.userID){
//       //ORGANIZE
//     }
//
//     file.save(function(err, newFile){
//       if(err) return next(err);
//       next();
//     });
//   });
// });
