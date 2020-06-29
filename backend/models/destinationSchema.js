const mongoose = require("mongoose");

const destinationSchema = mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true }
});

module.exports = mongoose.model("Destination", destinationSchema);
