const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  registerPassenger,
  getAllPassengers,
  loginPassenger,
  updatePassengerHandler,
  deletePassengerHandler,
  getPassengerById,
} = require("../../controllers/v1/passengerController");
const { validateToken } = require("../../middleware/auth");
router.post("/", registerPassenger);
router.get("/", getAllPassengers);
router.post("/login", loginPassenger);
router.put("/:id",validateToken, updatePassengerHandler);
router.delete("/:id", deletePassengerHandler);
router.get("/", getPassengerById);
module.exports = router;
