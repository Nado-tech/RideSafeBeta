const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true }, // email or phone number
  password: { type: String, required: true },
  token: { type: String, unique: true },
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
