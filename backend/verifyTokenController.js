const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json()); // Middleware for JSON requests

const ERCAS_PAY_URL = process.env.ERCAS_PAY_URL;
const ERCAS_SECRET_KEY = process.env.ERCAS_SECRET_KEY;

const tokens = {
  "12345": { name: "John Doe", car: "Toyota Corolla", plate: "ABJ-123-XYZ" },
  "67890": { name: "Jane Smith", car: "Honda Civic", plate: "LAG-456-ABC" },
};

// Utility function: Initialize payment
async function initializePayment(amount, paymentMethod, customerName, customerEmail, redirectUrl, description) {
  try {
    const response = await axios.post(
      `${ERCAS_PAY_URL}/payment/initiate`,
      { amount, paymentMethod, customerName, customerEmail, redirectUrl, description },
      { headers: { Authorization: `Bearer ${ERCAS_SECRET_KEY}`, "Content-Type": "application/json" } }
    );

    if (response.data.requestSuccessful) {
      return response.data.responseBody;
    } else {
      throw new Error(response.data.responseMessage || "Payment initialization failed");
    }
  } catch (error) {
    console.error("Payment Initialization Error:", error.response?.data || error.message);
    throw new Error("Unable to initialize payment");
  }
}

// Utility function: Verify transaction
async function fetchTransactionStatus(transactionRef) {
  try {
    const response = await axios.get(
      `${ERCAS_PAY_URL}/payment/transaction/verify/${transactionRef}`,
      { headers: { Authorization: `Bearer ${ERCAS_SECRET_KEY}` } }
    );
    return response.data.responseBody;
  } catch (error) {
    console.error("Transaction Verification Error:", error.response?.data || error.message);
    throw new Error("Unable to verify transaction");
  }
}

// Route: Verify Token
async function verifyToken(req, res) {
  const { token, paymentMethod } = req.body;

  // Validate token format
  if (!token || typeof token !== "string" || token.length !== 5) {
    return res.status(400).json({ message: "Invalid token format" });
  }

  const validPaymentMethods = ["card", "bank-transfer", "ussd"];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid payment method" });
  }
  try {
  const transactionStatus = await fetchTransactionStatus(paymentResponse.transactionReference);

  if (transactionStatus.status === "APPROVED" && tokens[token]) {
    return res.json({
      success: true,
      message: "Token verified successfully",
      driverInfo: tokens[token],
    });
  } else {
    return res.status(404).json({ message: "Payment not approved or token invalid" });
  }
} catch (error) {
  console.error("Error in verify-token route:", error.message);
  res.status(500).json({ message: "Internal Server Error" });
}
};
module.exports = verifyToken
