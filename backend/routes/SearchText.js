const express = require("express");

const Flight = require("../models/flightSchema");
const router = express.Router();
const mongoose = require("mongoose");
const AhoService = require("../services/AhoCorasickService")
const {
    to
} = require('await-to-js');
router.get("/:text", async (req, res, next) => {
    var searchParams = req.params.text;
    await to(AhoService.UpdateCms(searchParams));
    [err, result] = await to(AhoService.FindFlightByDestinations(searchParams))
    if (result) {
        console.log(result);
        res.status(200).json({
            Flights: result,
        });
    }
})


module.exports = router;