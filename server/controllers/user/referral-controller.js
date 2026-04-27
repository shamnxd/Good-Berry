const User = require('../../models/User');
const crypto = require('crypto');
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');

const referralController = {
  applyReferralCode: async (req, res) => {
    try {
      const { referralCode } = req.body;

      if (!referralCode) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.REFERRAL.REQUIRED });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER.NOT_FOUND });
      }

      if (user.referredBy) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.REFERRAL.ALREADY_APPLIED });
      }

      if (user.referralCode === referralCode) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.REFERRAL.CANNOT_USE_OWN });
      }

      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.REFERRAL.INVALID });
      }

      user.referredBy = referralCode;
      await user.save();

      res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.REFERRAL.SUCCESS });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.REFERRAL.APPLY_ERROR, error: error.message });
    }
  },

  getReferralCode: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER.NOT_FOUND });
      }

      if (!user.referralCode) {
        user.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        await user.save();
      }

      res.status(HTTP_STATUS.OK).json({ referralCode: user.referralCode, appliedCode: user.referredBy });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.REFERRAL.FETCH_ERROR, error: error.message });
    }
  },

  getReferredCount: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER.NOT_FOUND });
      }

      const referredCount = await User.countDocuments({ referredBy: user.referralCode });

      res.status(HTTP_STATUS.OK).json({ referredCount });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.REFERRAL.FETCH_COUNT_ERROR, error: error.message });
    }
  }
};

module.exports = referralController;
