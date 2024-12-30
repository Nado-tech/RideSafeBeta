const bcrypt = require('bcrypt'); // For password hashing
const Driver = require('../models/driver'); // Driver model

const driverSignup = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if the identifier already exists
  const driverExists = await Driver.findOne({ identifier });
  if (driverExists) {
    return res.status(400).json({ message: 'Driver already exists' });
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password.match(passwordRegex)) {
    return res.status(400).json({
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a token for the driver
  const token = Math.floor(10000 + Math.random() * 90000).toString(); // Generate token

  const driver = new Driver({ identifier, password: hashedPassword, token });
  await driver.save();

  res.status(201).json({ message: 'Driver signed up successfully', token });
};


module.exports = { driverSignup };
