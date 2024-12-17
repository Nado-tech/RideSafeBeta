const express = require('express');
const router = express.Router();
const { sendAlertToAuthorities } = require('../../controllers/v1/alertController');

// Route to handle sending alert to authorities (with photo)
router.post('/send-alert', sendAlertToAuthorities);

module.exports = router;
