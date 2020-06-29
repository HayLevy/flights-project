const express = require("express");

const Destination = require("../models/destinationSchema");
const Flight = require("../models/flightSchema");
const {
  to
} = require('await-to-js');
const router = express.Router();
const AhoService = require("../services/AhoCorasickService")

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const country = req.query.country;
  const city = req.query.city;
  console.log("Country = " + country);
  if (!country){
    console.log("no Country and City specified");
      const destinationQuery = Destination.find();
    let fetchedDestinations;
    if (pageSize && currentPage) {
      destinationQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    destinationQuery
      .then(documents => {
          fetchedDestinations = documents;
        return Destination.count();
      })
      .then(count => {
        res.status(200).json({
          message: "Destinations fetched successfully!",
          destinations: fetchedDestinations,
          maxDestinations: count
        });
      });
    }
  else{
    console.log("dest get by country and city");
    var query = { country: country, city: city };
    console.log("query = " + query);

    Destination.findOne(query).then(dest => {
      if (dest) {
        res.status(200).json(dest);
      } else {
        res.status(404).json({
          message: "Destination not found!"
        });
      }
    });
  }
});

router.post(
  "",
  (req, res, next) => {
    console.log("post request req.protocol: " + req.protocol);
    console.log("post request req.gethost: " + req.get("host"));
    console.log("post request req.body: " + req.body.country);
    console.log("post request req.body: " + req.body.city);
    const Dest = new Destination({
      country: req.body.country,
      city:req.body.city
    });
    Dest.save().then(async createdDest => {
      await to(AhoService.AddDestination({"city": req.body.city,
    "country":req.body.country}));
      res.status(201).json({
        message: "Flight added successfully",
        destination: {
          ...createdDest,
          id: createdDest._id
        }
      });
    });
  }
);

router.get("/:id", (req, res, next) => {
  console.log("dest get by ID");
  Destination.findById(req.params.id).then(dest => {
    if (dest) {
      res.status(200).json(dest);
    } else {
      res.status(404).json({
        message: "Destination not found!"
      });
    }
  });
});

router.put(
  "/:id",
  (req, res, next) => {
    const dest = new Destination({
      _id: req.body.id,
      city: req.body.city,
      country: req.body.country
    });
    console.log(dest);
    Destination.updateOne({
      _id: req.params.id 
    }, dest).then(async result => {
      if (result.n > 0){
        await to(AhoService.AddDestination({"city": req.body.city,
        "country":req.body.country}));
        res.status(200).json({
          message: "Update successful!"
        });
      }
      else{
        res.status(404).json({
          message: "Update failed... destination already deleted by another admin"
        });
      }
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Destination.deleteOne({
    _id: req.params.id
  }).then(async result => {
    console.log(result);
    if (result.n >0){
      [err,found]=await to(Flight.find({"destination":req.params.id}))
      if(found && found.length>0){
        await to(Flight.deleteMany({
          "destination":{
            "$in":found.map(obj=>obj.destination)
          }
        }));
      }
      res.status(200).json({
        message: "Destination deleted!"
      });
    }
    else{
      res.status(404).json({
        message: "Delete failed... destination already deleted by another admin"
      });
    }
  });
});


module.exports = router;