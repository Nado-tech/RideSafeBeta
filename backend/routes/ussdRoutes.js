const express = require('express');
const router = express.Router();
const ussdController = require('../controllers/ussdController');

// Define the USSD endpoint
router.post('/ussd', ussdController.handleUSSD);

module.exports = router;
