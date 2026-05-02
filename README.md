# 🍇 Good Berry - Premium E-commerce Experience

Good Berry is a modern, full-stack MERN e-commerce application designed for a premium shopping experience. It features a robust backend, a dynamic user interface, and seamless payment integrations.

## 🚀 Features

### 🛒 For Users
- **Dynamic Product Catalog**: Browse products with advanced filtering and search.
- **Secure Authentication**: OTP-based login, JWT session management, and Google OAuth integration.
- **Wallet System**: Add money to your virtual wallet via Razorpay and use it for instant checkouts.
- **Seamless Checkout**: Multi-step checkout process with integrated payment gateways.
- **Order Tracking**: Real-time order status updates and transaction history.
- **Wishlist & Cart**: Persistent cart and wishlist for a tailored shopping experience.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.

### 🛡️ For Admins
- **Comprehensive Dashboard**: Sales analytics and performance charts using Recharts.
- **Product Management**: Create, update, and manage products and variants.
- **Order Management**: Process orders, handle returns, and update delivery statuses.
- **Coupon System**: Manage discounts and promotional offers.
- **Export Reports**: Download sales data in PDF and Excel formats.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS, Redux Toolkit, Framer Motion, Radix UI.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Payments**: Razorpay.
- **Storage**: Cloudinary.
- **Deployment**: AWS EC2, GitHub Actions (CI/CD), PM2, Nginx.

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Razorpay API keys
- Cloudinary account

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/GoodBerry.git
   cd GoodBerry
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_key_id
   ```

4. **Run Locally**
   ```bash
   # In server directory
   npm run dev
   
   # In client directory
   npm run dev
   ```

## 🚢 Deployment (CI/CD)

This project is configured with **GitHub Actions** for automatic deployment to AWS EC2.

1. Push your changes to the `main` branch.
2. Ensure the following Secrets are set in your GitHub Repository:
   - `EC2_HOST`: Your server IP.
   - `EC2_USER`: Usually `ubuntu`.
   - `EC2_SSH_KEY`: Your `.pem` private key.

The workflow will automatically build the frontend and restart the backend using PM2 on your server.
---
Developed with ❤️ by [Muhammad Shamnad T](https://github.com/shamnxd)
