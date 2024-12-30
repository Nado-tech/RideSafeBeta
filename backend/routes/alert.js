const express = require('express');
const router = express.Router();
const { sendAlertToAuthorities } = require('../controllers/alertController');

// POST endpoint for alerting authorities
router.post('/alert-authorities', sendAlertToAuthorities);

module.exports = router;
