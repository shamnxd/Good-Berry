const Wallet = require('../../models/Wallet');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');


const walletController = {
  getWallet: async (req, res) => {
    try {
      const wallet = await Wallet.findOne({ userId: req.user.id });
      if (!wallet) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.WALLET_NOT_FOUND });
      }
      res.json(wallet);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_FETCHING_WALLET, error: error.message });
    }
  },

  addMoney: async (req, res) => {
    try {
      const { amount, description } = req.body;
      let wallet = await Wallet.findOne({ userId: req.user.id });

      if (!wallet) {
        wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
      }

      const parsedAmount = parseFloat(amount);
      wallet.balance += parsedAmount;
      wallet.transactions.push({ type: 'credit', amount: parsedAmount, description });

      await wallet.save();
      res.json(wallet);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_ADDING_MONEY_TO_WALLET, error: error.message });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const wallet = await Wallet.findOne({ userId: req.user.id });
      if (!wallet) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.WALLET_NOT_FOUND });
      }

      const transactions = wallet.transactions.slice((page - 1) * limit, page * limit);
      const totalTransactions = wallet.transactions.length;

      res.json({
        transactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_FETCHING_TRANSACTIONS, error: error.message });
    }
  },

  handleWalletPayment: async (req, res) => {
      try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId).populate('userId');
        if (!order) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ORDER_NOT_FOUND });
        }
  
        const wallet = await Wallet.findOne({ userId: order.userId._id });
        if (!wallet || wallet.balance < order.total) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.INSUFFICIENT_WALLET_BALANCE });
        }
  
        wallet.balance -= order.total;
        wallet.transactions.push({
          type: 'debit',
          amount: order.total,
          description: `Payment for order ${order.orderId}`
        });
        await wallet.save();
  
        order.paymentStatus = 'paid';
        order.status = 'processing';
        await order.save();
        
        const cart = await Cart.findOne({ userId: order.userId._id });
        cart.items = [];
        await cart.save();
  
        res.json({ message: MESSAGES.PAYMENT_SUCCESSFUL, orderId: order.orderId });
      } catch (error) {
        console.error('Error handling wallet payment:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_HANDLING_WALLET_PAYMENT, error: error.message });
      }
    }
};

module.exports = walletController;
