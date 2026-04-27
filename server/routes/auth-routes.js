const express = require("express");
const ROUTES = require('../constants/routes');

const router = express.Router();
const authController = require("../controllers/auth/auth-controller");
const passport = require("passport");

router.post(ROUTES.AUTH.REGISTER, authController.register);
router.post(ROUTES.AUTH.LOGIN, authController.login);
router.post(ROUTES.AUTH.LOGOUT, authController.logout);
router.post(ROUTES.AUTH.VERIFY, authController.verify);
router.post(ROUTES.AUTH.RESEND_OTP, authController.resendOtp);
router.post(ROUTES.AUTH.FORGET_PASSWORD, authController.forgetPassword);
router.post(ROUTES.AUTH.RESET_PASSWORD, authController.resetPassword);

router.get(ROUTES.AUTH.SET, authController.set);

// Google OAuth routes
router.get(ROUTES.AUTH.GOOGLE,
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get(ROUTES.AUTH.GOOGLE_CALLBACK,
    passport.authenticate('google', {
      failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
      session: false
    }),
    authController.googleAuth
);



router.post(ROUTES.AUTH.REFRESH_TOKEN, authController.refreshToken);

module.exports = router;