var mongoose = require("mongoose");

var tripSchema = new mongoose.Schema({
    passenger_id : String,
    location : String,
    destination: String,
    distance: String,
    price: Number,
    driver_id : String,
    status : String
});


module.exports = mongoose.model("Trip", tripSchema);