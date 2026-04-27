const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require("bcryptjs");
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');


const accountController = {
    getDetails: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            res.status(HTTP_STATUS.OK).json(user);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error);
        }
    },

    updateDetails: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
            }
            user.username = req.body.username;
            user.phone = req.body.phone;
            await user.save();
            res.status(HTTP_STATUS.OK).json({ success: true,message: MESSAGES.USER_DETAILS_UPDATED_SUCCESSFULLY, data:user });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
        }
    },

    changePassword: async (req, res) => {

        const { newPassword, currentPassword } = req.body;

        if(!newPassword || !currentPassword) {
            return res.json({ sussess: false, message: MESSAGES.MISSING_REQUIRED_FIELDS });
        }
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.json({ sussess: false, message: MESSAGES.USER_NOT_FOUND });
            }

            
            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return res.json({ sussess: false, message: MESSAGES.CURRENT_PASSWORD_IS_INCORRECT });
            }
            
            const checkOld = await bcrypt.compare(newPassword, user.password);
            if(checkOld) {
                return res.json({ sussess: false, message: MESSAGES.NEW_PASSWORD_CANNOT_BE_SAME_AS_OLD_PASSWORD });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();

            res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
        }
    }
};

module.exports = accountController;