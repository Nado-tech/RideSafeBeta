const bcrypt = require("bcrypt");
const  jwt = require ('jsonwebtoken');
const { Op } = require("sequelize");
const Passenger = require("../../models/passenger");
const dotenv = require('dotenv');
dotenv.config();

// @desc GET all passengers
// @route GET /v1/passengers
// @access Public
const getAllPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.findAll();
        res.status(200).json({ success: true, data: passengers });
    } catch (error) {
        console.error("Error fetching passengers:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch passengers" });
    }
};

// @desc POST register a new passenger
// @route POST /v1/passenger
// @access Public
const registerPassenger = async (req, res) => {
    const { name, email, phonenumber, password } = req.body;

    if (!name || !phonenumber || !password) {
        return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    try {
        // Check for duplicate email or phone number
        const existingPassenger = await Passenger.findOne({
            where: {
                [Op.or]: [{ email }, { phonenumber }],
            },
        });
        if (existingPassenger) {
            return res.status(400).json({ success: false, message: "Passenger already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate token and set expiration date
        const token = generateToken();
        const tokenExpiration = new Date();
        tokenExpiration.setFullYear(tokenExpiration.getFullYear() + 1);

        // Create passenger
        const newPassenger = await Passenger.create({
            name,
            email: email || null,
            phonenumber,
            password: hashedPassword,
            token,
            tokenExpiration,
        });

        res.status(201).json({
            success: true,
            data: newPassenger,
            message: "Passenger registered successfully",
        });
    } catch (error) {
        console.error("Error registering passenger:", error.message);
        res.status(500).json({ success: false, message: "Failed to register passenger" });
    }
};

// @desc POST login a passenger
// @route POST /v1/passenger/login
// @access Public
const loginPassenger = async (req, res) => {
    const { email, phonenumber, password } = req.body;
    const SECRET_KEY = process.env.JWT_SECRET_KEY
    
    if (!password || (!email && !phonenumber)) {
        return res.status(400).json({
            success: false,
            message: "Password and either email or phone number are required",
        });
    }

    try {
        const passenger = await Passenger.findOne({
            where: {
                [Op.or]: [{ email }, { phonenumber }],
            },
        });

        if (!passenger) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, passenger.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const payload = {
                id: passenger.id,
                name: passenger.name,
                email: passenger.email,
                phonenumber: passenger.phonenumber,
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

// @desc GET passenger by ID
// @route GET /v1/passenger/:id
// @access Public
const getPassengerById = async (req, res) => {
    try {
        const id = Number (req.params.id);
        if (typeof id !== 'number'){
            return res.status(404).json({ success: false, message: "ID must be a number" });
        }
        const passenger = await Passenger.findOne({where: {id: id}});
        if (!driver ) {
        res.status(404).json({ success: false, message: "Passenger not found" });
        return;
        }
        res.status(200).json(passenger);
        return;
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

// @desc PUT update passenger by ID
// @route PUT /v1/passenger/:id
// @access Public
const updatePassengerHandler = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const schema = Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phonenumber: Joi.string().optional(),
        plateNumber: Joi.string().optional(),
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
        // Step 2: Find the passenger in the database
        const passenger = await Passenger.findByPk(id);

        if (!passenger) {
            return res.status(404).json({ success: false, message: "Passenger not found" });
        }

        // Step 3: Update the passenger fields in the database
        await driver.update(updates);

        // Step 4: Respond with the updated passenger data
        res.status(200).json({
            success: true,
            data: driver,
            message: "Passenger updated successfully",
        });
    } catch (error) {
        console.error("Error updating passenger:", error.message);
        res.status(500).json({ success: false, message: "Failed to update passenger" });
    }
};
// @desc DELETE passenger by ID
// @route DELETE /v1/passenger/:id
// @access Public
const deletePassengerHandler = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (typeof id !=='number'|| isNaN(id)) {
            res.status(404).json({ success: false, message: "Passenger not found" });
            return;
        }

        const passenger = await Passenger.findOne({where: {id: id}})
        if (!passenger) {
            res.status(404).json({message: 'Passenger not found'});
            return;
        }
        await passenger.destroy();
        res.status(200).json({ success: true, message: "Passenger deleted successfully" });
    } catch (error) {
        console.error("Error deleting Passenger:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete passenger" });
    }
};
module.exports = {
    getAllPassengers,
    registerPassenger,
    loginPassenger,
    getPassengerById,
    updatePassengerHandler,
    deletePassengerHandler,
};
