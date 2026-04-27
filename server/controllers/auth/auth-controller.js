const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Order = require("../../models/Order");
const { SendVerificationCode, SendWelcomeMessage, SendResetPasswordLink } = require("../../middleware/email");
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username || user.name,
        },
        process.env.JWT_SECRET || "This the thing i love",
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET || "This the refresh thing i love",
        { expiresIn: "30d" }
    );

    return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password)
            return res.json({
                success: false,
                message: MESSAGES.PLEASE_ENTER_NAME_EMAIL_AND_PASSWORD,
            });

        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: MESSAGES.USER_ALREADY_EXISTS_WITH_THE_SAME_EMAIL_PLEASE_TRY_TO_LOGIN,
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashPassword
        });

        await newUser.save();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.otp = otp;
        req.session.email = email;
        req.session.otpExpiresAt = Date.now() + 300000;
        console.log(otp)

        SendVerificationCode(email, otp);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MESSAGES.PLEASE_CHECK_YOUR_EMAIL_TO_VERIFY_YOUR_ACCOUNT,
        });
    } catch (e) {
        console.log(e);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.SOME_ERROR_OCCURED,
        });
    }
};

//login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
            return res.json({
                success: false,
                message: MESSAGES.PLEASE_ENTER_EMAIL_AND_PASSWORD,
            });

        const checkUser = await User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: MESSAGES.USER_DOESN_T_EXISTS_PLEASE_REGISTER_FIRST,
            });

        if (checkUser.isBlocked)
            return res.json({
                success: false,
                message: MESSAGES.ACCOUNT_HAS_BEEN_SUSPENDED_PLEASE_CONTACT_ADMIN,
            });

        if (!checkUser.isVerified) {

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(otp)

            SendVerificationCode(checkUser.email, otp);
            req.session.otp = otp;
            req.session.email = checkUser.email;
            req.session.otpExpiresAt = Date.now() + 300000;

            return res.json({
                success: false,
                isVerify: true,
                message: MESSAGES.PLEASE_VERIFY_YOUR_ACCOUNT_FIRST,
            });
        }

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );
        if (!checkPasswordMatch)
            return res.json({
                success: false,
                message: MESSAGES.INCORRECT_PASSWORD_PLEASE_TRY_AGAIN,
            });

        const { accessToken, refreshToken } = generateTokens(checkUser);

        checkUser.refreshTokens.push(refreshToken);
        await checkUser.save();

        setTokenCookies(res, accessToken, refreshToken);
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MESSAGES.LOGGED_IN_SUCCESSFULLY,
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                username: checkUser.username,
            },
        });
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.SOME_ERROR_OCCURED,
        });
    }
};


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token && !refreshToken)
        return res.json({
            success: false,
            message: MESSAGES.PLEASE_LOGIN_FIRST,
        });

    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "This the thing i love");
            req.user = decoded;
            const user = await User.findById(decoded.id);
            if (!user || user.isBlocked) {
                res.clearCookie("token");
                res.clearCookie("refreshToken");
                return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.USER_IS_BLOCKED_OR_DELETED });
            }
            return next();
        }
    } catch (e) {
        if (e.name !== "TokenExpiredError" && e.message !== "jwt expired") {
            return res.json({ success: false, message: MESSAGES.INVALID_TOKEN });
        }
    }

    if (!refreshToken) {
        return res.json({ success: false, message: MESSAGES.SESSION_EXPIRED_PLEASE_LOGIN_AGAIN });
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "This the refresh thing i love");
        const user = await User.findById(decodedRefresh.id);
        
        // Ensure user exists, is not blocked, and token exists in DB
        if (!user || user.isBlocked || !user.refreshTokens.includes(refreshToken)) {
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.INVALID_OR_REVOKED_REFRESH_TOKEN });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);
        
        // Refresh Token Rotation
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        setTokenCookies(res, newAccessToken, newRefreshToken);

        req.user = jwt.decode(newAccessToken);
        next();

    } catch (e) {
        return res.json({ success: false, message: MESSAGES.SESSION_EXPIRED_PLEASE_LOGIN_AGAIN });
    }
};

const googleAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('${process.env.CLIENT_URL}/auth/login?error=auth_failed');
        }

        if (req.user.isBlocked) {
            return res.redirect('${process.env.CLIENT_URL}/auth/login?error=blocked_user');
        }

        const user = await User.findById(req.user._id);
        const { accessToken, refreshToken } = generateTokens(user);
        
        user.refreshTokens.push(refreshToken);
        await user.save();

        setTokenCookies(res, accessToken, refreshToken);

        return res.redirect('${process.env.CLIENT_URL}?login=success');

    } catch (error) {
        console.error('Google auth error:', error);
        return res.redirect('${process.env.CLIENT_URL}/auth/login?error=internal_error');
    }
};

const verify = async (req, res) => {
    const { otp } = req.body;

    const sessionOtp = req.session.otp;
    const sessionEmail = req.session.email;
    const otpExpiresAt = req.session.otpExpiresAt;

    if (!sessionOtp || !sessionEmail) {
        return res.json({ message: MESSAGES.SOMETHING_WENT_WRONG });
    }


    if (Date.now() > otpExpiresAt) {
        return res.json({ message: MESSAGES.OTP_EXPIRED_TRY_AGAIN });
    }

    if (sessionOtp !== otp) {
        return res.json({ message: MESSAGES.INVALID_OTP });
    }

    const user = await User.findOne({ email: sessionEmail });
    user.isVerified = true;
    await user.save();

    req.session.otp = null;
    req.session.email = null;
    req.session.otpExpiresAt = null;

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set cookie and redirect in one response
    setTokenCookies(res, accessToken, refreshToken);

    SendWelcomeMessage(user.email);


    res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.LOGGED_IN_SUCCESSFULLY, user });
};

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "This the refresh thing i love", { ignoreExpiration: true });
            const user = await User.findById(decoded.id);
            if (user) {
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                await user.save();
            }
        } catch (e) {
            console.error("Error during logout:", e);
        }
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json({
        success: true,
        message: MESSAGES.LOGGED_OUT_SUCCESSFULLY,
    });
};

const set = async (req, res) => {

    try {
        const order = await Order.find({});
        await Promise.all(
            order.map(order => {
                order.couponDiscount = 0;
                return order.save();
            })
        );

        res.json({
            success: true,
            message: MESSAGES.SET_SUCCESSFULLY,
        });

    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR_SETTING, error: error.message });
    }

};

const resendOtp = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.otp = otp;
        req.session.email = req.session.email;

        console.log(otp);

        SendVerificationCode(req.session.email, otp);
        if (!req.session.email) return res.json({ success: false, message: MESSAGES.SOMETHING_WENT_WRONG });
        req.session.otpExpiresAt = Date.now() + 300000; // 5 minutes in milliseconds
        res.json({ success: true, message: MESSAGES.OTP_SENT_SUCCESSFULLY, });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_SENDING_OTP, error: error.message });
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.json({
                success: false,
                message: MESSAGES.PLEASE_ENTER_YOUR_EMAIL_ADDRESS,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: MESSAGES.USER_WITH_THIS_EMAIL_DOES_NOT_EXIST,
            });
        }

        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            "This the thing i love",
            { expiresIn: "5m" }
        );

        // Store the token in user document
        user.resetPasswordToken = {
            token: resetToken,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        };
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
        SendResetPasswordLink(user.email, resetLink);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MESSAGES.PASSWORD_RESET_LINK_HAS_BEEN_SENT_TO_YOUR_EMAIL,
        });
    } catch (error) {
        console.error("Error sending reset password link:", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.FAILED_TO_SEND_RESET_PASSWORD_LINK,
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if(password.length < 8){
        return res.json({
            success: false,
            message: MESSAGES.PASSWORD_MUST_BE_8_CHARACTERS,
        });
    }

    try {
        if (!token) {
            return res.json({
                success: false,
                message: MESSAGES.TOKEN_IS_REQUIRED,
            });         
        }

        const decoded = jwt.verify(token, "This the thing i love");
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.json({
                success: false,
                message: MESSAGES.INVALID_TOKEN_OR_USER_DOES_NOT_EXIST,
            });
        }

        // Check if token exists and matches
        if (!user.resetPasswordToken || user.resetPasswordToken.token !== token) {
            return res.json({
                success: false,
                message: MESSAGES.INVALID_OR_EXPIRED_RESET_TOKEN,
            });
        }

        // Check if token has expired
        if (new Date() > user.resetPasswordToken.expiresAt) {
            // Clear the expired token
            user.resetPasswordToken = undefined;
            await user.save();
            
            return res.json({
                success: false,
                message: MESSAGES.RESET_TOKEN_HAS_EXPIRED,
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        user.password = hashPassword;
        // Clear the used token
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
        });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.TOKEN_HAS_EXPIRED,
            });
        }
        console.error("Error resetting password:", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.FAILED_TO_RESET_PASSWORD,
            error: error.message,
        });
    }
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.SESSION_EXPIRED_PLEASE_LOGIN_AGAIN });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "This the refresh thing i love");
        const user = await User.findById(decoded.id);

        if (!user || user.isBlocked || !user.refreshTokens.includes(refreshToken)) {
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.INVALID_OR_REVOKED_REFRESH_TOKEN });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        setTokenCookies(res, accessToken, newRefreshToken);
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MESSAGES.TOKEN_REFRESHED_SUCCESSFULLY,
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
                username: user.username || user.name,
            }
        });
    } catch (error) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.SESSION_EXPIRED_PLEASE_LOGIN_AGAIN });
    }
};

module.exports = {
    register,
    login,
    authMiddleware,
    logout,
    googleAuth,
    verify,
    resendOtp,
    set,
    forgetPassword,
    resetPassword,
    refreshToken
};
