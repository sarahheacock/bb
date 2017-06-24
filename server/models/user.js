'use strict';

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const temp = new Date().toString().split(' ');
const NOW = new Date(temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3] + " 10:00:00").getTime();

var sortUpcoming = function(a, b){
  //negative if a before b
  //0 if unchanged order
  //position if a after b
  return b.arrive - a.arrive;
};

var makeid = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var UpcomingSchema = new Schema({
  arrive: Number,
  depart: Number,
  guests: Number,
  room: Schema.Types.ObjectId,
  userEmail: String,
  createdAt: {type:Date, default:Date.now},
});

UpcomingSchema.method("update", function(updates, callback){
  Object.assign(this, updates, {updatedAt: new Date()});
  this.parent().save(callback);
});

var CreditSchema = new Schema({
  name: {type: String, default: ''},
  number: {type: String, default: ''},
  //cvv: {type: String, default: ''}
})

var UserSchema = new Schema({
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
    type: CreditSchema,
    default: CreditSchema
  },
  userID: {
    type: String,
    default: makeid
  },
  pageID: Schema.Types.ObjectId,
  upcoming: [UpcomingSchema],
});

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
  // else if(user.credit.cvv.length <= 16){
  //   bcrypt.hash(user["credit"]["cvv"], 10, function(err, hash){
  //     if (err) {
  //       return next(err);
  //     }
  //     user["credit"]["cvv"] = hash;
  //     next();
  //   })
  // }
  else{
    if(user.upcoming !== undefined) user.upcoming.sort(sortUpcoming);
    next();
  }
});

var Upcoming = mongoose.model("Upcoming", UpcomingSchema);
var User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
  Upcoming: Upcoming
};
