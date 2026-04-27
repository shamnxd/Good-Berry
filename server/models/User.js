const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true 
    },
    password: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    role : {
        type: String,
        required: true,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        token: String,
        expiresAt: Date
    },
    referralCode: {
        type: String,
        unique: true,
    },
    referredBy: {
        type: String, 
        default: null,
    },
    referralBonusApplied: {
        type: Boolean,
        default: false,
    },
    refreshTokens: [{
        type: String,
    }],

});

const User = mongoose.model("User", UserSchema);

module.exports = User;