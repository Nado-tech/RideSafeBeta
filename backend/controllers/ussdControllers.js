exports.handleUSSD = (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        response = `CON Welcome to RideSafe!
        Enter your verification code:`;
    } else if (text === '12345') { // Replace with dynamic verification logic
        response = `END Verification successful. Thank you!`;
    } else {
        response = `END Invalid code. Please try again.`;
    }

    res.send(response);
};
