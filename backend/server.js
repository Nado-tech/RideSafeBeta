require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require("./routes/v1/verifyTokenRoute");
const driversRouter = require("./routes/v1/driver");
const passengerRouter = require("./routes/v1/passenger");
const alertRouter = require("./routes/v1/alert");
const ussdRouter = require("./routes/v1/ussdRoutes");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/v1/driver", driversRouter);
console.log("Driver routes initialized.");

app.use("/v1/passenger", passengerRouter); // Corrected
console.log("Passenger routes initialized.");

app.use("/v1/alert", alertRouter);
app.use("/v1/ussdRoutes", ussdRouter);
app.use("/v1/verifyToken", verifyToken); // Fixed missing leading slash

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
