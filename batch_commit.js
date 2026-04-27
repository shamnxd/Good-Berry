const { execSync } = require('child_process');

const commits = [
    { files: ['client/src/api/endpoints.js'], msg: 'feat(api): centralize all api endpoints' },
    { files: ['client/src/api/index.js'], msg: 'feat(api): implement axios instance with refresh token interceptor' },
    { files: ['server/constants/routes.js'], msg: 'feat(server): centralize route constants' },
    { files: ['server/constants/messages.js'], msg: 'feat(server): centralize response messages' },
    { files: ['server/constants/statusCodes.js'], msg: 'feat(server): centralize http status codes' },
    { files: ['client/src/constants/messages.js'], msg: 'feat(client): sync message constants with server' },
    { files: ['server/server.js'], msg: 'refactor(server): use environment variables for CORS and secrets' },
    { files: ['server/middleware/email.js'], msg: 'refactor(server): use environment variables for email credentials' },
    { files: ['server/controllers/auth/auth-controller.js'], msg: 'feat(auth): implement dual token rotation and user info in refresh' },
    { files: ['server/middleware/auth.js'], msg: 'feat(auth): implement refresh token rotation in auth middleware' },
    { files: ['server/routes/auth-routes.js'], msg: 'refactor(auth): update auth routes and remove redundant auth-check' },
    { files: ['client/src/store/auth-slice/index.js'], msg: 'refactor(auth): update checkAuth to use refresh token logic' },
    { files: ['client/src/store/admin-slice/coupon-slice.js'], msg: 'refactor(store): update coupon slice to use central api' },
    { files: ['client/src/store/admin-slice/offer-slice.js'], msg: 'refactor(store): update offer slice to use central api' },
    { files: ['client/src/store/admin-slice/order-slice.js'], msg: 'refactor(store): update admin order slice to use central api' },
    { files: ['client/src/store/shop-slice/cart-slice.js'], msg: 'refactor(store): update cart slice to use central api' },
    { files: ['client/src/store/shop-slice/order-slice.js'], msg: 'refactor(store): update shop order slice to use central api' },
    { files: ['client/src/store/shop-slice/index.js'], msg: 'refactor(store): update general shop slice to use central api' },
    { files: ['client/src/store/user-slice/account-slice.js'], msg: 'refactor(store): update account slice to use central api' },
    { files: ['client/src/store/user-slice/wallet-slice.js'], msg: 'refactor(store): update wallet slice to use central api' },
    { files: ['server/controllers/user/cart-controller.js'], msg: 'refactor(api): use central constants in cart controller' },
    { files: ['server/controllers/user/address-controller.js'], msg: 'refactor(api): use central constants in address controller' },
    { files: ['server/controllers/user/wallet-controller.js'], msg: 'refactor(api): use central constants in wallet controller' },
    { files: ['server/controllers/user/wishlist-controller.js'], msg: 'refactor(api): use central constants in wishlist controller' },
    { files: ['server/controllers/admin/order-controller.js'], msg: 'refactor(api): use central constants in admin order controller' },
    { files: ['server/controllers/admin/product-controller.js'], msg: 'refactor(api): use central constants in admin product controller' },
    { files: ['server/controllers/admin/category-controller.js'], msg: 'refactor(api): use central constants in admin category controller' },
    { files: ['client/src/pages/auth/login.jsx'], msg: 'refactor(ui): update login page to use central constants' },
    { files: ['client/src/pages/auth/register.jsx'], msg: 'refactor(ui): update register page to use central constants' },
    { files: ['client/src/pages/shop/cart/checkout.jsx'], msg: 'refactor(ui): update checkout page to use central constants' },
    { files: ['client/src/components/shop/header.jsx'], msg: 'refactor(ui): update shop header to use central constants' },
    { files: ['client/src/components/admin/sidebar.jsx'], msg: 'refactor(ui): update admin sidebar to use central constants' },
];

commits.forEach(c => {
    try {
        console.log(`Committing: ${c.msg}`);
        c.files.forEach(f => {
            execSync(`git add "${f}"`, { stdio: 'inherit' });
        });
        execSync(`git commit -m "${c.msg}"`, { stdio: 'inherit' });
    } catch (e) {
        console.log(`Skipping commit (possibly no changes): ${c.msg}`);
    }
});

// Final catch-all commit
try {
    console.log('Committing remaining changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "chore: cleanup and refactor remaining files to use central constants"', { stdio: 'inherit' });
} catch (e) {
    console.log('No remaining changes to commit.');
}
