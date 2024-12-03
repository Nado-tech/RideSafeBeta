// routes/passengerRoutes.js

const express = require('express');
const axios = require('axios');  // Import axios to make HTTP requests
const Passenger = require('../models/passenger');
const router = express.Router();

// VerifyMe Nigeria API configuration
const VERIFYME_BASE_URL = "https://api-sandbox.verifyme.ng";
const VERIFYME_API_KEY = "your-verifyme-api-key"; // Replace with your API key, not yet given

// Helper function to verify NIN via API
async function verifyIdentity(identityType, identityNumber) {
  try {
    const response = await axios.post(
      `${VERIFYME_BASE_URL}/v1/verifications/${identityType}`,
      { id: identityNumber },
      {
        headers: {
          Authorization: `Bearer ${VERIFYME_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.success) {
      return response.data.data; // Return verified data
    } else {
      throw new Error('Verification failed');
    }
  } catch (error) {
    console.error('Error verifying identity:', error.response?.data || error.message);
    throw new Error('Unable to verify identity');
  }
}


// Passenger signup route
router.post('/signup', async (req, res) => {
  const { name, email, phoneNumber, password, nin } = req.body;

  // Step 1: Verify the NIN using the NIN API
  try {
    const ninVerification = await verifyIdentity(nin);
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
