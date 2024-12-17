const express = require("express");
const router = express.Router();
const verifyToken  = require("../../controllers/v1/verifyTokenController");

// Route to verify token and process payment
router.post("/verifyToken", verifyToken);

module.exports = router;
