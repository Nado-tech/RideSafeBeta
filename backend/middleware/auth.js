const jwt = require('jsonwebtoken');
const Driver = require('../models/driver');
const Passenger = require('../models/passenger');

const validateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

    if (!token) {
        return res.status(401).json({ message: 'Token missing from authorization header' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const driver = await Driver.findOne({ where: { id: payload.id } });
        const passenger = !driver ? await Passenger.findOne({ where: { id: payload.id } }) : null;

        const user = driver || passenger;
        if (!user) {
            return res.status(401).json({ message: 'User not found or not authorized' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { validateToken };
