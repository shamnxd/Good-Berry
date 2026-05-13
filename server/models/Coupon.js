const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponId: { type: String },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  minimumAmount: { type: Number, required: true },
  used: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' }
}, { timestamps: true });


module.exports = mongoose.model('Coupon', couponSchema);
