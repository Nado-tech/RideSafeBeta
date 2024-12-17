const express = require("express");
const router = express.Router();
const { initiatePayment, verifyPayment } = require("../controllers/paymentController");

// Route to initiate payment
router.post("/initiate-payment", initiatePayment);

// Route to verify payment
router.get("/verify-payment/:paymentReference", verifyPayment);

module.exports = router;
