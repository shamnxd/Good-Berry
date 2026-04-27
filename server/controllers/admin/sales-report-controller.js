const Order = require('../../models/Order');
const { subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay } = require('date-fns');
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');


const salesReportController = {
  generateSalesReport: async (req, res) => {
    try {
      const { 
        period, 
        startDate, 
        endDate, 
        page = 1, 
        limit = 10, 
        search = '', 
        downloadAll = false 
      } = req.query;

      let start, end;
      const today = new Date();

      switch (period) {
        case 'day':
          start = startOfDay(subDays(today, 1));
          end = endOfDay(today);
          break;
        case 'week':
          start = startOfDay(subWeeks(today, 1));
          end = endOfDay(today);
          break;
        case 'month':
          start = startOfDay(subMonths(today, 1));
          end = endOfDay(today);
          break;
        case 'year':
          start = startOfDay(subYears(today, 1));
          end = endOfDay(today);
          break;
        case 'custom':
          start = startOfDay(new Date(startDate));
          end = endOfDay(new Date(endDate));
          break;
        default:
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_PERIOD });
      }

      const query = {
        createdAt: {
          $gte: start,
          $lte: end
        },
        status: 'delivered'
      };

      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'userId.username': { $regex: search, $options: 'i' } }
        ];
      }

      const totalOrders = await Order.countDocuments(query);
    
      let ordersQuery = Order.find(query)
        .populate('userId', 'username')
        .populate('addressId')
        .sort({ createdAt: -1 });

      if (!downloadAll) {
        ordersQuery = ordersQuery
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
      }

      // Execute the query
      const orders = await ordersQuery;

      const report = {
        period,
        startDate: start,
        endDate: end,
        orders,
        overallSalesCount: orders.reduce((sum, order) => sum + order.items.length, 0),
        overallOrderCount: orders.length,
        overallOrderAmount: orders.reduce((sum, order) => sum + order.total, 0),
        overallDiscount: orders.reduce((sum, order) => sum + order.discount, 0),
        overallCouponDiscount: orders.reduce((sum, order) => sum + order.couponDiscount, 0)
      };

      // Only include pagination info if not downloading all
      if (!downloadAll) {
        report.currentPage = parseInt(page);
        report.totalPages = Math.ceil(totalOrders / limit);
        report.totalOrders = totalOrders;
      }

      res.json(report);
    } catch (error) {
      console.error('Error generating sales report:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_GENERATING_SALES_REPORT, error: error.message });
    }
  }
};

module.exports = salesReportController;