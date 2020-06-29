const AhoCorasick = require('node-aho-corasick');
const Destination = require("../models/destinationSchema");
const Flight = require("../models/flightSchema");
const cmsService = require('../services/CMSService.js')

const mongoose = require("mongoose");
const {
    to
} = require('await-to-js');

const Dest = new AhoCorasick();
const AhoService = {
    construct: async function () {
        [err, found] = await to(Destination.find());
        if (found) {
            found.forEach(element => {
                Dest.add(element.country);
                Dest.add(element.city);
            });
            Dest.build();
        }
    },
    FindFlightByDestinations: async function (destText) {
        var destInText = (Dest.search(destText));
        let unique = [...new Set(destInText)];
        [err, found] = await to(Flight.aggregate([{

                "$lookup": {
                    from: "destinations",
                    localField: "destination",
                    foreignField: "_id",
                    as: "res"
                }
            },
            {
                "$match": {
                    "$or": [{
                            "res.city": {
                                "$in": unique
                            }
                        },
                        {
                            "res.country": {
                                "$in": unique
                            }
                        }
                    ]
                }

            }
        ]))
        if (found) {
            var retVal = found.map(function (item) {
                return {
                    _id: item._id,
                    price: item.price,
                    destination: {
                        _id: item.res[0]._id,
                        country: item.res[0].country,
                        city: item.res[0].city
                    },
                    landing: item.landing,
                    takeoff: item.takeoff
                }
            })


            console.log(retVal)
            return retVal;
        }
    },
    AddDestination: async function (dest) {
        Dest.add(dest.city);
        Dest.add(dest.country);
        Dest.build();
    },
    UpdateCms: async function (destArr) {
        var destInText = (Dest.search(destArr));
        let unique = [...new Set(destInText)];
        [err, result] = await to(Destination.aggregate([{
            "$match": {
                "$or": [{
                        "city": {
                            "$in": unique
                        }
                    },
                    {
                        "country": {
                            "$in": unique
                        }
                    }
                ]
            }
        }]));
        result.forEach(async element => {
            await to(cmsService.updateKey(element));
        });
        console.log(result);
    }
}



module.exports = AhoService;