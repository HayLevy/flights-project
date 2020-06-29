const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  takeoff: { type: Date, required: true },
  landing: { type: Date, required: true },
  price: { type: Number, required: true },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  }
  //destination: { type: String, required: true }
});

module.exports = mongoose.model("Flight", flightSchema);
