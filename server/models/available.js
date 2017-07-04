'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var d = new Date();

var FreeSchema = new Schema({
  roomID: Schema.Types.ObjectId,
  reserved: {type: Number, default: 0}
});

var AvailableSchema = new Schema({
  pageID: Schema.Types.ObjectId,
  date: {type: Date, default: d.setHours(10)},
  free: {type: [FreeSchema], default: [FreeSchema]}
});

AvailableSchema.statics.updateDates = function(req, callback) {
  var end = parseInt(req.end) - (24*60*60*1000);
  var begin = parseInt(req.start);

  var dateArr = [];
  var results = [];

  while(end >= begin){
    dateArr.push(new Date(end));
    end = end - (24*60*60*1000);
  }

  if(end < begin){

    dateArr.forEach(function(thisDate, dindex){
      if (req.user) var id = req.user.pageID
      else var id = req.page._id;

      Available.findOne({ pageID: id, date: thisDate }, function(err, date){

        if(err || !date) return next(err);
        date.free.forEach(function(d, index){
          if(d.roomID.equals(req.roomID)){
            if(req.dir){
              d.reserved += 1;
            }
            else {
              d.reserved -= 1;
            }

            if(date.free.length === index + 1 && dateArr.length === dindex + 1){
              date.save(callback);
            }
          }
          else if(date.free.length === index + 1 && dateArr.length === dindex + 1){
            date.save(callback);
          }
        });

      });
    });
  }
}



var Available = mongoose.model("Available", AvailableSchema);

module.exports.Available = Available;
