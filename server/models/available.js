'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var sortFree = function(a, b){
  return b.roomID - a.roomID;
};

var d = new Date();
var FreeSchema = new Schema({
  roomID: Schema.Types.ObjectId,
  reserved: {type: Number, default: 0}
});

FreeSchema.method("update", function(vote, callback){
  if(vote === "reserve"){
    this.reserved += 1;
  }
  else {
    this.reserved -= 1;
  }
  this.parent().save(callback);
});

var AvailableSchema = new Schema({
  pageID: Schema.Types.ObjectId,
  date: {type: Date, default: d.setHours(10)},
  free: {type: [FreeSchema], default: [FreeSchema]}
});

AvailableSchema.pre('save', function(next) {
  var available = this;
  if(available.free !== undefined) available.free.sort(sortFree);
  next();
});


var Available = mongoose.model("Available", AvailableSchema);

module.exports.Available = Available;
