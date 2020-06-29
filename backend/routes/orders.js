const express = require("express");

const User = require("../models/userSchema");
const Flight = require("../models/flightSchema");
const { to } = require('await-to-js');

const router = express.Router();

router.put(
  "",
  async (req, res, next) => {
    console.log("post request req.body.userId: " + req.body.userId);
      console.log("post request req.body.flight: " + req.body.flightId);
      console.log("post request req.body.quantity: " + req.body.quantity);

      User.findById(req.body.userId).then(res => console.log(res));
      [err,flight] =await to(Flight.findById(req.body.flightId));
      if(flight!=null){
      var updateQuery = { 
        $push:  { 
              orders: {
                flight: req.body.flightId, 
                quantity: req.body.quantity 
              }
        }
    };

      User.findByIdAndUpdate(req.body.userId, updateQuery)
      .then(result => {
            res.status(200).json({
              message: "Update order successful!"
            });
      });
    }
    else{
      res.status(404).json({
        message: "something went wrong... pls try again later!"
      });
    }
  }
);
  

  
  router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    var ordersQuery;
   
    ordersQuery = User.findById(req.user.id).populate({path:"orders.flight", populate:{path: "destination"}});
    
    let fetchedOrders;
    if (pageSize && currentPage) {
      ordersQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    ordersQuery
    .then(user => {
      if (req.query.destination && req.query.takeoff && req.query.price){
        var filteredOrders;
        var takeoffDate = Date.parse(req.query.takeoff);
        var country = req.query.destination.split(',')[0].trim();
        var city = req.query.destination.split(',')[1].trim();
        filteredOrders = user.orders._doc.orders.filter(order =>  order.flight != null 
                                                                &&  Date.parse(order.flight.takeoff) >= takeoffDate
                                                                && order.flight.destination._doc.country === country
                                                                && order.flight.destination._doc.city === city
                                                                && order.flight.price <= req.query.price);
        return filteredOrders;
      }
      else
        return user.orders._doc.orders;
    })
      .then(documents => {
        fetchedOrders = documents;
        return fetchedOrders.length;
      })
      .then(count => {
        res.status(200).json({
          message: "User orders fetched successfully!",
          orders: fetchedOrders,
          maxOrders: count
        });
      });
  });
  
  
  module.exports = router;