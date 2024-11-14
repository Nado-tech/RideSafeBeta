const Alert = require('../models/alertModels'); // If using a model to store alerts
const { sendEmailToAuthorities, sendSMSToAuthorities } = require('../services/notificationService'); // Notification service

// Controller method to handle alert
async function sendAlertToAuthorities(req, res) {
  const { photo, latitude, longitude } = req.body;

  try {
    // Step 1: Save the alert to the database (model interaction)
    const alert = await Alert.create({ photo, latitude, longitude });

    // Step 2: Send notifications (email, SMS, etc.)
    await sendEmailToAuthorities(photo, latitude, longitude);
    await sendSMSToAuthorities(latitude, longitude);

    res.status(200).json({ message: 'Alert sent to authorities successfully' });
  } catch (error) {
    console.error('Error sending alert to authorities:', error);
    res.status(500).json({ message: 'Failed to send alert to authorities' });
  }
}

module.exports = { sendAlertToAuthorities };
