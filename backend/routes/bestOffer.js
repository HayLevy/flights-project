const {
  to
} = require('await-to-js');

const express = require("express");
const cmsService = require('../services/CMSService.js')
const Destination = require("../models/destinationSchema");

const router = express.Router();

router.get("", async (req, res, next) => {
  console.log("get by bestOFFER");
  var a = cmsService.getMax();
  var isDestFound = false;
  if (a != null){
    [err,response]=await to(Destination.findById(a));
    if (response != null){
      isDestFound = true;
      res.status(200).json(response);
    }
  }    
  if (!isDestFound){
    [err,response]=await to(Destination.findOne());
    res.status(200).json(response);
  }
    
});

router.post("", (req, res, next) => {
  console.log("Post is in proccess by bestOffer.js");
  console.log("post request req.body: " + req.body.id);
  console.log("post request req.body: " + req.body.country);
  console.log("post request req.body: " + req.body.city);
  cmsService.updateKey(req.body);
  res.status(201).json({
    message: "CMS updated successfully"
  });
});



module.exports = router;