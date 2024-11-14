// routes/driverRoutes.js

const express = require('express');
const axios = require('axios');  // Import axios to make HTTP requests
const Driver = require('../models/driver');
const { generateUniqueToken } = require('../services/tokenServices');
const router = express.Router();

// FRSC API endpoint and key (replace with actual endpoint and API key)
const FRSC_API_URL = 'https://frsc.gov.ng/api/validate-plate';
const FRSC_API_KEY = 'your-frsc-api-key';  // Replace with your FRSC API key

// Helper function to verify plate number via FRSC API
async function verifyPlateNumber(plateNumber) {
  try {
    const response = await axios.post(FRSC_API_URL, {
      plateNumber: plateNumber,
      apiKey: FRSC_API_KEY,
    });
    return response.data;  // Return response data from FRSC API
  } catch (error) {
    console.error('Error verifying plate number:', error);
    throw new Error('Unable to verify plate number');
  }
}

// Driver signup route
router.post('/signup', async (req, res) => {
  const { email, phoneNumber, password, plateNumber } = req.body;

  // Step 1: Verify the plate number using the FRSC API
  try {
    const plateVerification = await verifyPlateNumber(plateNumber);
    if (!plateVerification.isValid) {
      return res.status(400).json({ message: 'Invalid plate number' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Plate number verification failed' });
  }

  // Step 2: Proceed with the normal signup process if plate number is valid
  const existingDriver = await Driver.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingDriver) {
    return res.status(400).json({ message: 'Driver already exists with this email or phone number' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique 5-digit token
  const token = await generateUniqueToken(Driver);

  // Create a new driver with the valid plate number and unique token
  const newDriver = new Driver({
    email,
    phoneNumber,
    password: hashedPassword,
    plateNumber,
    token,  // Store the unique token
  });

  // Save the driver
  try {
    await newDriver.save();
    res.status(201).json({
      message: 'Driver registered successfully',
      driver: { email, phoneNumber, plateNumber, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
