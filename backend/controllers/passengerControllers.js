const bcrypt = require('bcrypt'); // For password hashing
const Passenger = require('../models/passenger'); // Passenger model

const passengerSignup = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if the identifier already exists
  const passengerExists = await Passenger.findOne({ identifier });
  if (passengerExists) {
    return res.status(400).json({ message: 'Passenger already exists' });
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

  const passenger = new Passenger({ identifier, password: hashedPassword });
  await passenger.save();

  res.status(201).json({ message: 'Passenger signed up successfully' });
};

module.exports = { passengerSignup };
