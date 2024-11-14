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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
