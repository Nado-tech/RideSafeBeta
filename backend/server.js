const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passengerRoutes = require('./routes/passenger');
const driverRoutes = require('./routes/driver'); // Import driver routes

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Passenger Routes
app.use('/passenger', passengerRoutes);

// Driver Routes
app.use('/driver', driverRoutes); // Use driver routes

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Define the contact schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Add the contact form route
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill out all fields.' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ success: true, message: 'Message received successfully.' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ success: false, message: 'Failed to save message. Try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
