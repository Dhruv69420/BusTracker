const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
  },
  busLat: {
    type: String,
    required: true,
  },
  busLong: {
    type: String,
    required: true,
  },
  stops: [
    {
      stopLat: {
        type: String,
        required: true,
      },
      stopLong: {
        type: String,
        required: true,
      },
    },
  ],
});

routeSchema.methods.updateStops = function () {};

const Route = mongoose.model("ROUTE", routeSchema);
module.exports = Route;
