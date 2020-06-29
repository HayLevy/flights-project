const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cmsService = require("./services/CMSService.js");
const AhoService=require("./services/AhoCorasickService");
const User = require("./models/userSchema");

const usersRoutes = require("./routes/users");
const flightsRoutes = require("./routes/flights");
const destinationsRoutes = require("./routes/destinations");
const bestOfferRoutes = require("./routes/bestOffer");
const flightSearchRoutes = require("./routes/flightSearch");
const CountFlightRoutes = require("./routes/CountFlight");
const AvgDestination = require("./routes/AvgDestination");
const SearchText=require("./routes/SearchText");
const ordersRoutes = require("./routes/orders");

const app = express();
AhoService.construct();
loggedUsers = 0;



mongoose.connect('mongodb://localhost:27017/flights')
  .then(() => {
    console.log("Connected to database!");
    //console.log("Maximum value in Sketch is : " + cmsService.getMax());

  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/flights", flightsRoutes);
app.use("/api/destinations", destinationsRoutes);
app.use("/api/bestOffer", bestOfferRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/login", usersRoutes)
app.use("/api/logout", usersRoutes);
app.use("/api/flightSearch", flightSearchRoutes);
app.use("/api/CountFlight", CountFlightRoutes);
app.use("/api/AvgDest", AvgDestination);
app.use("/api/SearchText", SearchText);

app.param("userId", function (req, res, next, id) {
  User.findById(id, function (err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});

app.use("/api/users/:userId/orders", ordersRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});


module.exports = app;