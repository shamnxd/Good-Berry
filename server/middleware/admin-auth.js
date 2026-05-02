const jwt = require('jsonwebtoken');
const MESSAGES = require('../constants/messages');
const HTTP_STATUS = require('../constants/statusCodes');

const admin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.AUTHENTICATION_REQUIRED_PLEASE_LOGIN_FIRST
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "This the thing i love");
        if (decoded.role !== 'admin') {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.YOU_ARE_NOT_AN_ADMIN });
        }
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.INVALID_AUTHENTICATION_TOKEN });
    }
};

module.exports = admin;