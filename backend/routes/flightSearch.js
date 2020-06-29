const express = require("express");

const Flight = require("../models/flightSchema");

const router = express.Router();

router.get("/:params", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
var searchParams = JSON.parse(req.params.params);
var takeoffDate = Date.parse(searchParams.takeoff);
//
var flightQuery = Flight.find({
  destination: searchParams.destination,
  price: {
    $lte: searchParams.price
  },
  takeoff: {
    $gte: takeoffDate
  }
}).populate("destination");
if (pageSize && currentPage) {
  flightQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
}
flightQuery.then(documents => {
    fetchedFlights = documents;
    return Flight.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Flights fetched successfully!",
      flights: fetchedFlights,
      maxFlights: count
    });
  });
})

module.exports = router;