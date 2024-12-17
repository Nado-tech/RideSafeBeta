const Alert = require('../../models/alertModels'); // Model for alerts
const { sendEmailToAuthorities, sendSMSToAuthorities } = require('../../services/notificationServices'); // Notification service
const multer = require('multer');

// Set up multer for file uploads with size and type validation
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
}).single('photo');

// Utility function to handle multer uploads
const uploadPhoto = (req, res) =>
  new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// Controller method to handle alert
async function sendAlertToAuthorities(req, res) {
  try {
    // Upload photo
    await uploadPhoto(req, res);

    const { latitude, longitude } = req.body;
    const photoBuffer = req.file ? req.file.buffer : null;

    // Validate required fields
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    if (!photoBuffer) {
      return res.status(400).json({ message: 'No photo provided' });
    }

    // Save alert to database
    const alert = await Alert.build({
      photo: photoBuffer,
      latitude: latitude,
      longitude: longitude,
    });

    await alert.save();

    // Send notifications
    await sendEmailToAuthorities(photoBuffer, latitude, longitude);
    await sendSMSToAuthorities(latitude, longitude);

    // Respond to client
    res.status(200).json({
      message: 'Alert sent to authorities successfully',
      alertId: alert.id,
    });
  } catch (error) {
    console.error('Error sending alert:', error);
    res.status(500).json({
      message:
        process.env.NODE_ENV === 'development' ? error.message : 'Failed to send alert to authorities',
    });
  }
}

module.exports = { sendAlertToAuthorities };
