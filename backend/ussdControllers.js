const africastalking = require('africastalking');
const { Pool } = require("pg");

// PostgreSQL database connection
const pool = new Pool({
    user: "RideSafe",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5434, // Default PostgreSQL port
});

// Africa's Talking API credentials
const username = 'your_africastalking_username';
const apiKey = 'your_africastalking_api_key';
const africasTalking = africastalking({ username, apiKey });

// The amount you want to charge the user
const chargeAmount = 20; // 20 Naira

// USSD logic for processing the verification code and payment
const verifyDriverToken = async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = "";

    try {
        const userInput = text.trim();

        if (userInput === "") {
            // Inform the user about the charge before asking for the verification code
            response = `CON This service will be charged at 20 Naira. Please type '1' to proceed.`;
        } else if (userInput === "1") {
            // Proceed with the payment process
            const paymentResponse = await africasTalking.payment.mobilePayment({
                phoneNumber,  // User's phone number
                amount: chargeAmount,
                currencyCode: "NGN", // Naira
            });

            if (paymentResponse.status === "success") {
                // If payment is successful, prompt the user to enter the verification code
                response = `CON Enter your verification code:`;
            } else {
                // Payment failed, inform the user
                response = `END Payment failed. Please ensure you have sufficient balance and try again.`;
            }
        } else if (userInput !== "1" && userInput !== "") {
            // User entered a verification code
            const query = `
                SELECT name, plate_number, car_type 
                FROM drivers 
                WHERE token = $1
            `;
            const result = await pool.query(query, [userInput]);

            if (result.rows.length > 0) {
                const driver = result.rows[0];
                response = `END Driver verified.\nName: ${driver.name}\nPlate Number: ${driver.plate_number}\nCar Type: ${driver.car_type}`;
            } else {
                response = `END Invalid code. Please try again.`;
            }
        }

        // Send the USSD response
        res.set("Content-Type", "text/plain");
        res.send(response);
    } catch (error) {
        console.error("Error processing USSD request:", error.message);
        res.set("Content-Type", "text/plain");
        res.send("END An error occurred. Please try again later.");
    }
};

module.exports = {
    verifyDriverToken,
};
