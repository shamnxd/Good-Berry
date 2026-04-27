const express = require('express');
const ROUTES = require('../constants/routes');

const router = express.Router();
const cartController = require('../controllers/user/cart-controller');
const accountController = require('../controllers/user/account-controller');
const addressController = require('../controllers/user/address-controller');
const orderController = require('../controllers/common/order-controller');
const wishlistController = require('../controllers/user/wishlist-controller');
const couponController = require('../controllers/common/coupon-controller');
const paymentController = require('../controllers/common/payment-controller');
const walletController = require('../controllers/user/wallet-controller');
const referralController = require('../controllers/user/referral-controller');
const auth = require('../middleware/auth');

router.use(auth);

// Cart
router.get(ROUTES.USER.CART, cartController.getCart); 
router.post(ROUTES.USER.CART, cartController.addToCart);
router.post(ROUTES.USER.CART_SYNC, cartController.syncCart);
router.put(ROUTES.USER.CART_BY_ITEMID, cartController.updateQuantity);  
router.delete(ROUTES.USER.CART_BY_ITEMID, cartController.removeItem);  
router.delete(ROUTES.USER.CART_CLEAR, cartController.clearCart);  

// Account
router.get(ROUTES.USER.BASE, accountController.getDetails);
router.patch(ROUTES.USER.BASE, accountController.updateDetails);

// Change Password
router.patch(ROUTES.USER.CHANGE_PASSWORD, accountController.changePassword);

// Address
router.get(ROUTES.USER.ADDRESSES, addressController.getAllAddresses);
router.post(ROUTES.USER.ADDRESSES, addressController.addAddress);
router.put(ROUTES.USER.ADDRESSES_BY_ID, addressController.updateAddress);
router.put(ROUTES.USER.ADDRESSES_BY_ID_SET_DEFAULT, addressController.setDefaultAddress);
router.delete(ROUTES.USER.ADDRESSES_BY_ID, addressController.deleteAddress);

// Order
router.post(ROUTES.USER.ORDER, orderController.createOrder);
router.get(ROUTES.USER.ORDER, orderController.getOrders); 
router.get(ROUTES.USER.ORDER_BY_ID, orderController.getOrderById);
router.put(ROUTES.USER.ORDER_BY_ID_CANCEL, orderController.cancelOrder);
router.put(ROUTES.USER.ORDER_BY_ID_RETURN, orderController.returnOrderItem);

// Coupons
router.get(ROUTES.USER.COUPONS, couponController.getValidCoupons);
router.post(ROUTES.USER.APPLY_COUPON, couponController.applyCoupon);
router.post(ROUTES.USER.CHECK_COUPON, couponController.checkCoupon);

// Payment 
router.post(ROUTES.USER.CREATE_RAZORPAY_ORDER, paymentController.createRazorpayOrder);
router.post(ROUTES.USER.VERIFY_PAYMENT, paymentController.verifyPayment);
router.post(ROUTES.USER.PAYMENT_FAILURE, paymentController.handlePaymentFailure);

// Wishlist
router.get(ROUTES.USER.WISHLIST, wishlistController.getWishlist);
router.post(ROUTES.USER.WISHLIST, wishlistController.addToWishlist);
router.delete(ROUTES.USER.WISHLIST_BY_PRODUCTID_BY_VARIANTID, wishlistController.removeFromWishlist);

// Wallet
router.get(ROUTES.USER.WALLET, walletController.getWallet);
router.post(ROUTES.USER.WALLET_PAYMENT, walletController.handleWalletPayment);
router.post(ROUTES.USER.WALLET_ADD_MONEY, walletController.addMoney);
router.get(ROUTES.USER.WALLET_TRANSACTIONS, walletController.getTransactions);

// Referral
router.post(ROUTES.USER.APPLY_REFERRAL, referralController.applyReferralCode);
router.get(ROUTES.USER.REFERRAL_CODE, referralController.getReferralCode);
router.get(ROUTES.USER.REFERRED_COUNT, referralController.getReferredCount);

module.exports = router;