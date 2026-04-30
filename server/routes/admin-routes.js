const express = require('express');
const ROUTES = require('../constants/routes');

const router = express.Router();
const categoryController = require('../controllers/admin/category-controller');
const userController = require('../controllers/admin/user-controller');
const productController = require('../controllers/admin/product-controller');
const orderController = require('../controllers/admin/order-controller');
const offerController = require('../controllers/admin/offer-controller');
const couponController = require('../controllers/common/coupon-controller');
const salesReportController = require('../controllers/admin/sales-report-controller');
const dashboardController = require('../controllers/admin/dashboard-controller');
const admin = require('../middleware/admin-auth');

router.use(admin);

// Customer
router.get(ROUTES.ADMIN.USERS, userController.getAllUsers);
router.patch(ROUTES.ADMIN.USERS_BY_ID_BLOCK, userController.updateUser);

// Product
router.get(ROUTES.ADMIN.PRODUCTS, productController.getAllProducts);
router.post(ROUTES.ADMIN.PRODUCTS, productController.addProduct);
router.get(ROUTES.ADMIN.PRODUCTS_BY_ID, productController.getProduct);
router.put(ROUTES.ADMIN.PRODUCTS_BY_ID, productController.updateProduct);
router.patch(ROUTES.ADMIN.PRODUCTS_BY_ID, productController.unListProduct);

// Category
router.post(ROUTES.ADMIN.CATEGORIES, categoryController.addCategory);
router.get(ROUTES.ADMIN.CATEGORIES, categoryController.getAllCategories);
router.put(ROUTES.ADMIN.CATEGORIES_BY_ID, categoryController.updateCategory);

// Offer
router.post(ROUTES.ADMIN.CATEGORY_OFFER, offerController.addCategoryOffer);
router.post(ROUTES.ADMIN.CATEGORY_OFFER_REMOVE, offerController.removeCategoryOffer);

// Product Offer
router.post(ROUTES.ADMIN.PRODUCTS_BY_ID_OFFER, offerController.addProductOffer);
router.delete(ROUTES.ADMIN.PRODUCTS_BY_ID_OFFER, offerController.removeProductOffer);

// Coupon
router.get(ROUTES.ADMIN.COUPONS, couponController.getAllCoupons);
router.post(ROUTES.ADMIN.COUPONS, couponController.addCoupon);
router.put(ROUTES.ADMIN.COUPONS_BY_ID, couponController.updateCoupon);
router.delete(ROUTES.ADMIN.COUPONS_BY_ID, couponController.deleteCoupon);

// Order
router.get(ROUTES.ADMIN.ORDERS, orderController.getAllOrders);
router.get(ROUTES.ADMIN.ORDERS_BY_ID, orderController.getOrderById);
router.patch(ROUTES.ADMIN.ORDERS_BY_ORDERID_ITEMS_BY_PRODUCTID, orderController.updateOrderItemStatus);
router.put(ROUTES.ADMIN.ORDERS_BY_ORDERID_ITEMS_BY_PRODUCTID_APPROVE_RETURN, orderController.approveReturnRequest);
router.put(ROUTES.ADMIN.ORDERS_BY_ORDERID_ITEMS_BY_PRODUCTID_REJECT_RETURN, orderController.rejectReturnRequest);

// Sales Report
router.get(ROUTES.ADMIN.SALES_REPORT, salesReportController.generateSalesReport);

// Dashboard
router.get(ROUTES.ADMIN.DASHBOARD, dashboardController.getDashboardData);

module.exports = router;
