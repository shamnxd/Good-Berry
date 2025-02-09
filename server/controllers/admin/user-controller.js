const User = require('../../models/User');
const Order = require('../../models/Order');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.aggregate([
      { $match: searchQuery }, 
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders',
        },
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' }, 
        },
      },
      { $project: { orders: 0 } }, 
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const totalUsers = await User.countDocuments(searchQuery);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { isBlocked } = req.body; 
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
};