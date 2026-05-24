const mongoose = require('mongoose');

const ORDER_STATUSES = ['Pending', 'Packing', 'Packed', 'Completed'];

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', required: true },
  },
  { timestamps: true }
);

orderSchema.index({ outletId: 1, createdAt: -1 });

const pad4 = (n) => String(n).padStart(4, '0');

const makeOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 10000);
  return `BQ-${y}${m}${d}-${pad4(rand)}`;
};

orderSchema.pre('save', function preSave(next) {
  if (!this.orderNumber) this.orderNumber = makeOrderNumber();
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, ORDER_STATUSES };
