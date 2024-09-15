// authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Make sure to require jwt

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, error: 'Invalid token.' });
            }
            req.user = user; // Attach user info to the request object
            next(); // Call next middleware
        });
    } else {
        res.status(401).json({ success: false, error: 'Authorization token missing.' });
    }
};

module.exports = authenticateJWT;
