const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize"); // Sequelize operator
const Driver = require("../../models/driver");
const Joi = require("joi");
const  jwt = require ('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Utility function to generate a random 5-digit token
const generateToken = () => crypto.randomInt(10000, 100000).toString();

// @desc GET all drivers
// @route GET /v1/drivers
// @access Public
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    console.error("Error fetching drivers:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch drivers" });
  }
};

// @desc POST register a new driver
// @route POST /v1/driver
// @access Public
const registerDriver = async (req, res) => {
  const { name, email, nin, phonenumber, password, plateNumber, vehicle } =
    req.body;
  if (typeof name !== "string")
    return res.status(400).json({ message: "Name must be a string" });
  if (typeof email !== "string" || !email.includes("@"))
    return res.status(400).json({ message: "Invalid email format" });
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }
  if (!name || !nin || !phonenumber || !password || !plateNumber || !vehicle) {
    return res.status(400).json({ success: false, message: "Required fields are missing" });
  }

  try {
    // Check for duplicate NIN or plateNumber
    const existingDriver = await Driver.findOne({
      where: {
        [Op.or]: [{ email }, { nin }, { phonenumber }, { plateNumber }],
      },
    });
    if (existingDriver) {
      return res
        .status(400)
        .json({ success: false, message: "Driver already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token and set expiration date
    const token = generateToken();
    const tokenExpiration = new Date();
    tokenExpiration.setFullYear(tokenExpiration.getFullYear() + 1);

    // Create driver
    const newDriver = await Driver.create({
      name,
      email: email || null,
      nin,
      phonenumber,
      password: hashedPassword,
      plateNumber,
      vehicle,
      token,
      tokenExpiration,
    });

    res.status(201).json({
      success: true,
      data: newDriver,
      message: "Driver registered successfully",
    });
  } catch (error) {
    console.error("Error registering driver:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to register driver" });
  }
};

// @desc POST login a driver
// @route POST /v1/driver/login
// @access Public
const loginDriver = async (req, res) => {
    const { email, phonenumber, password } = req.body;
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
  
    if (!password || (!email && !phonenumber)) {
      return res.status(400).json({
        success: false,
        message: "Password and either email or phone number are required",
      });
    }
  
    try {
      // Find the driver by email or phone number
      const driver = await Driver.findOne({
        where: {
          [Op.or]: [{ email }, { phonenumber }],
        },
      });
  
      if (!driver) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, driver.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }
  
      // Create payload for the JWT
      const payload = {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phonenumber: driver.phonenumber,
        plateNumber: driver.plateNumber,
        vehicle: driver.vehicle
      };
  
      // Create access token and refresh token
      const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
      const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
  
      // Optional: Store refresh token in httpOnly cookie for better security
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production to use HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      return res.status(200).json({
        message: "Login successful",
        accessToken, // Send the access token in the response body
        refreshToken
      });
  
    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(500).json({ success: false, message: "Failed to login" });
    }
  };
  
// @desc GET driver by ID
// @route GET /v1/driver/:id
// @access Public
const getDriverById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (typeof id !== "number") {
      return res
        .status(404)
        .json({ success: false, message: "ID must be a number" });
    }
    const driver = await Driver.findOne({ where: { id: id } });
    if (!driver) {
      res.status(404).json({ success: false, message: "Driver not found" });
      return;
    }
    res.status(200).json(driver);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc PUT update driver by ID
// @route PUT /v1/driver/:id
// @access Public

const updateDriverHandler = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phonenumber: Joi.string().optional(),
    plateNumber: Joi.string().optional(),
    vehicle: Joi.string().optional(),
    token: Joi.string().optional(),
    tokenExpiration: Joi.string().optional(),
  });

  const { error } = schema.validate(updates, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      details: error.details,
    });
  }

  try {
    // Step 2: Find the driver in the database
    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Step 3: Update the driver fields in the database
    await driver.update(updates);

    // Step 4: Respond with the updated driver data
    res.status(200).json({
      success: true,
      data: driver,
      message: "Driver updated successfully",
    });
  } catch (error) {
    console.error("Error updating driver:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update driver" });
  }
};

// @desc DELETE driver by ID
// @route DELETE /v1/driver/:id
// @access Public
const deleteDriverHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (typeof id !== "number" || isNaN(id)) {
      res.status(404).json({ success: false, message: "Driver not found" });
      return;
    }

    const driver = await Driver.findOne({ where: { id: id } });
    if (!driver) {
      res.status(404).json({ message: "Driver not found" });
      return;
    }
    await driver.destroy();
    res
      .status(200)
      .json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete driver" });
  }
};
// @desc POST Renew Driver Token
// @route POST /v1/driver/:id/renew-token
// @access Public
const renewToken = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the driver by ID
    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Check if the token is still valid
    const now = new Date();
    if (now < new Date(driver.tokenExpiration)) {
      return res.status(400).json({
        success: false,
        message: "Token is still valid and cannot be renewed yet",
      });
    }

    // Generate a new token and set expiration for 1 year
    const newToken = generateToken();
    const tokenExpiration = new Date();
    tokenExpiration.setFullYear(tokenExpiration.getFullYear() + 1);

    // Update token and expiration
    driver.token = newToken;
    driver.tokenExpiration = tokenExpiration;

    await driver.save();

    res.status(200).json({
      success: true,
      data: {
        id: driver.id,
        name: driver.name,
        token: driver.token,
        tokenExpiration: driver.tokenExpiration,
      },
      message: "Token renewed successfully",
    });
  } catch (error) {
    console.error("Error renewing token:", error.message);
    res.status(500).json({ success: false, message: "Failed to renew token" });
  }
};

module.exports = {
  getAllDrivers,
  registerDriver,
  loginDriver,
  getDriverById,
  updateDriverHandler,
  deleteDriverHandler,
  renewToken,
};
