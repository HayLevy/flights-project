const express = require("express");

const Flight = require("../models/flightSchema");
const router = express.Router();
const mongoose = require("mongoose");

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
            select: '_id city country',
            model: 'Destination'
        }).then(o => {
            return o.map(maping => {
                var country,value;
                if(maping._id!=null){
                    var country = maping._id.country;
                    var value = maping.value;
                }
                else
              {
                country="Germany"
                value="10000000"
              }
                return {
                    "name": country,
                    "value": parseInt(value)
                }

            })
        }).then(o1 => {
            var sortedResult = o1.sort(function (a, b) {
                return a.value - b.value
            });
            sortedResult = sortedResult.slice(0, 5)
            
            res.status(200).json({
                AvgDest: sortedResult,
            });
           
        })


    })
})
module.exports = router;