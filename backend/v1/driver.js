const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  getAllDrivers,
  registerDriver,
  renewToken,
  getDriverById,
  updateDriverHandler,
  deleteDriverHandler,
  loginDriver,
} = require("../../controllers/v1/driversController");
const { validateToken } = require("../../middleware/auth");
router.post("/", registerDriver);
router.get("/", getAllDrivers);
router.get("/:id", getDriverById);
router.post("/:id/renew-token", renewToken);
router.post("/login", loginDriver);
router.put("/:id", validateToken, updateDriverHandler);
router.delete("/:id", deleteDriverHandler);

module.exports = router;
