const express = require('express');
const ROUTES = require('../constants/routes');

const router = express.Router();
const upload = require('../middleware/multer');
const uploadController = require('../controllers/common/upload-controller');
const homeController = require('../controllers/common/home-controller');
const shopController = require('../controllers/common/shop-controller');
const cartController = require('../controllers/user/cart-controller');

router.post(ROUTES.COMMON.UPLOAD, upload.single('image'), uploadController.uploadImage);

router.get(ROUTES.COMMON.FEATURED, homeController.getFeatured);
router.get(ROUTES.COMMON.PRODUCTS, shopController.getAllProducts);
router.get(ROUTES.COMMON.PRODUCTS_BY_ID, shopController.getProductDetails);
router.get(ROUTES.COMMON.CATEGORIES, shopController.getCategories);
router.post(ROUTES.COMMON.CHECK_QUANTITY, cartController.checkQuantity);



module.exports = router;