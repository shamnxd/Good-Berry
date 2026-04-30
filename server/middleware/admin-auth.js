const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MESSAGES = require('../constants/messages');
const HTTP_STATUS = require('../constants/statusCodes');


const admin = async (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token && !refreshToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.AUTHENTICATION_REQUIRED_PLEASE_LOGIN_FIRST
        });
    }

    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "This the thing i love");
            if (decoded.role !== 'admin') {
                return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.YOU_ARE_NOT_AN_ADMIN });
            }
            req.user = decoded;
            return next();
        }
    } catch (error) {
        if (error.name !== 'TokenExpiredError' && error.message !== "jwt expired") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.INVALID_AUTHENTICATION_TOKEN });
        }
    }

    if (!refreshToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.SESSION_EXPIRED_PLEASE_LOGIN_AGAIN });
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "This the refresh thing i love");
        const user = await User.findById(decodedRefresh.id);

        if (!user || user.isBlocked || !user.refreshTokens.includes(refreshToken)) {
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.INVALID_OR_REVOKED_REFRESH_TOKEN });
        }
        if (user.role !== 'admin') {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.YOU_ARE_NOT_AN_ADMIN });
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                username: user.username,
            },
            process.env.JWT_SECRET || "This the thing i love",
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET || "This the refresh thing i love",
            { expiresIn: "7d" }
        );

        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = jwt.decode(newAccessToken);
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.SESSION_EXPIRED_PLEASE_LOGIN_AGAIN });
    }
};

module.exports = admin;