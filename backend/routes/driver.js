// routes/driverRoutes.js

const express = require('express');
const axios = require('axios'); // Import axios for HTTP requests
const bcrypt = require('bcrypt'); // For password hashing
const Driver = require('../models/driver');
const { generateUniqueToken } = require('../services/tokenServices');
const router = express.Router();

// VerifyMe Nigeria API configuration
const VERIFYME_BASE_URL = "https://api-sandbox.verifyme.ng"; // Use sandbox for testing
const VERIFYME_API_KEY = "your-verifyme-api-key"; // Replace with your actual API key

// FRSC API configuration
//const FRSC_API_URL = "https://frsc-api-url.example.com/verify-plate"; // Replace with actual FRSC API URL
//const FRSC_API_KEY = "your-frsc-api-key"; // Replace with your actual FRSC API key

// Helper function to verify identity via VerifyMe
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

// Helper function to verify plate number via FRSC API
// async function verifyPlateNumber(plateNumber) {
//   try {
//     const response = await axios.post(
//       FRSC_API_URL,
//       { plateNumber },
//       {
//         headers: {
//           Authorization: `Bearer ${FRSC_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (response.data && response.data.isValid) {
//       return response.data; // Return response data from FRSC API
//     } else {
//       throw new Error('Invalid plate number');
//     }
//   } catch (error) {
//     console.error('Error verifying plate number:', error.response?.data || error.message);
//     throw new Error('Unable to verify plate number');
//   }
// }

// Driver signup route
router.post('/signup', async (req, res) => {
  const { email, phoneNumber, password, identityType, identityNumber, plateNumber } = req.body;

  // Validate required fields
  if (!email || !phoneNumber || !password || !identityType || !identityNumber || !plateNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Step 1: Verify identity using VerifyMe API
  try {
    const verifiedIdentity = await verifyIdentity(identityType, identityNumber);
    if (!verifiedIdentity) {
      return res.status(400).json({ message: 'Invalid identity details' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Identity verification failed' });
  }

  // Step 2: Verify the plate number using FRSC API
  // try {
  //   const plateVerification = await verifyPlateNumber(plateNumber);
  //   if (!plateVerification.isValid) {
  //     return res.status(400).json({ message: 'Invalid plate number' });
  //   }
  // } catch (error) {
  //   return res.status(500).json({ message: 'Plate number verification failed' });
  // }

  // Step 3: Check if the driver already exists
  const existingDriver = await Driver.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingDriver) {
    return res.status(400).json({ message: 'Driver already exists with this email or phone number' });
  }

  // Step 4: Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 5: Generate a unique 5-digit token
  const token = await generateUniqueToken(Driver);

  // Step 6: Create a new driver
  const newDriver = new Driver({
    email,
    phoneNumber,
    password: hashedPassword,
    plateNumber,
    token, // Unique token
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
