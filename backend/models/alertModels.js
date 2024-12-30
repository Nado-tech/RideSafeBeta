const mongoose = require('mongoose');

// Define the schema for alert data
const alertSchema = new mongoose.Schema({
  photo: String, // Store the photo as a base64 string or link to a file
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

// Create the Alert model based on the schema
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
