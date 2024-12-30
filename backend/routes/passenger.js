// routes/passengerRoutes.js

const express = require('express');
const axios = require('axios');  // Import axios to make HTTP requests
const Passenger = require('../models/passenger');
const router = express.Router();

// NIN API endpoint and key (replace with actual endpoint and API key)
const NIN_API_URL = 'https://nin-api.com/validate';
const NIN_API_KEY = 'your-nin-api-key';  // Replace with your NIN API key

// Helper function to verify NIN via API
async function verifyNIN(nin) {
  try {
    const response = await axios.post(NIN_API_URL, {
      nin: nin,
      apiKey: NIN_API_KEY,
    });
    return response.data;  // Return response data from NIN API
  } catch (error) {
    console.error('Error verifying NIN:', error);
    throw new Error('Unable to verify NIN');
  }
}

// Passenger signup route
router.post('/signup', async (req, res) => {
  const { name, email, phoneNumber, password, nin } = req.body;

  // Step 1: Verify the NIN using the NIN API
  try {
    const ninVerification = await verifyNIN(nin);
    if (!ninVerification.isValid) {
      return res.status(400).json({ message: 'Invalid NIN' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'NIN verification failed' });
  }

  // Step 2: Proceed with the normal signup process if NIN is valid
  const existingPassenger = await Passenger.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingPassenger) {
    return res.status(400).json({ message: 'Passenger already exists with this email or phone number' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new passenger
  const newPassenger = new Passenger({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    nin,
  });

  // Save the passenger
  try {
    await newPassenger.save();
    res.status(201).json({
      message: 'Passenger registered successfully',
      passenger: { name, email, phoneNumber, nin },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
