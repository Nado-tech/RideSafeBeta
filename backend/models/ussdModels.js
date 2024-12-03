const User = require('../models/userModel');

exports.handleUSSD = async (req, res) => {
    const { text, phoneNumber } = req.body;

    if (text === '') {
        res.send(`CON Welcome! Enter your verification code:`);
    } else {
        const isValid = await User.verifyCode(phoneNumber, text);
        if (isValid) {
            res.send(`END Verification successful.`);
        } else {
            res.send(`END Invalid code.`);
        }
    }
};
