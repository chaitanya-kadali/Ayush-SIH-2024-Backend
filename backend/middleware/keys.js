const Joi = require('joi');
const jwt = require('jsonwebtoken');
const JWT_SECRET="secret_key_for_StartupPortal";

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    crop_name: Joi.string().required(),
    language: Joi.string().optional()
  });


  // Middleware to verify JWT token
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Extract token from Bearer header
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, error: 'Invalid token.' });
            }
            // Attach user information to the request
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ success: false, error: 'Authorization token missing.' });
    }
};
  module.exports=schema;
  module.exports=authenticateJWT;