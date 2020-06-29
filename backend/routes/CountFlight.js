const express = require("express");

const Flight = require("../models/flightSchema");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/",(req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
   var query=Flight.aggregate([
      { "$project": { 
              "month": { "$month": "$takeoff" }
          }},  
          { "$group": {
              "_id": "$month", 
              "count": { "$sum": 1 }
          }}
      ])
      query.then(obj=>{
           var result= obj.map(va=>{
                return {
                    "name":va._id,
                    "value":va.count
                };
            })
        var sortedResult=result.sort(function(a, b){return a.name - b.name});
        res.status(200).json({
            CountFlight: sortedResult,
          }); 
    })
  })

/*
const AvgDestPrice = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    },
    value: {
        type: Number
    }
});

mongoose.model('AvgDestPrice', AvgDestPrice);

router.get("/", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const o = {};
    o.out = {
        replace: 'AvgDestPrice'
    }
    o.map = function () {
        emit(this.destination, this.price)
    }

    o.reduce = function (key, values) {

        return Array.avg(values);
    }

    Flight.mapReduce(o, function (err, data) {
        data.model.find().populate({
            path: '_id',
            select: '_id City Country',
            model: 'Destination'
        }).then(o => {
           return o.map(maping => {
                var country = maping._id.Country;
                var value=maping.value;
                return {
                    "name": country,
                    "value": parseInt(value)
                }

            })
        }).then(o1=>{
            var sortedResult=o1.sort(function(a, b){return a.value - b.value});
            sortedResult=sortedResult.slice(0,5)
            res.status(200).json({
                AvgDest: sortedResult,
              }); 
        })
       

        if (err)
            console.log("error")
    })
})*/
module.exports = router;