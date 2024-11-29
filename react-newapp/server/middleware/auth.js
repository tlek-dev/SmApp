const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../logger');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        logger.warn('Access attempt without token');
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        logger.error('Invalid token:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
