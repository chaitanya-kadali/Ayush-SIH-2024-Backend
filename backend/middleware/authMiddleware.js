// authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Make sure to require jwt

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ tokenSuccess: false, error: 'Invalid token -> from backend' });
            }
            return res.status(200).json({ tokenSuccess: true, message: 'Token is Valid' });
        });
    } else {
        return res.status(401).json({ tokenSuccess: false, error: 'Authorization token missing. -> from backend' });
    }
};


module.exports = authenticateJWT;
