const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router()
const { verifyDriverToken } = require("../../controllers/v1/ussdControllers");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// USSD route
app.post("/ussd", verifyDriverToken); // Use the controller for handling the USSD requests

module.exports = router