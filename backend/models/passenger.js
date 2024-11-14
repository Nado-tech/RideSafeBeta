const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true },  // email or phone number
  password: { type: String, required: true },
});

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;
