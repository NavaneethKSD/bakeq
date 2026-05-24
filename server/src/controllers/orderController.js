const mongoose = require('mongoose');
const { Order, ORDER_STATUSES } = require('../models/Order');
const { Product } = require('../models/Product');
const { HttpError } = require('../utils/httpError');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const listOrders = async (req, res) => {
  const { outletId, status, orderNumber } = req.query;

  const filter = {};
  if (outletId) filter.outletId = outletId;
  if (status) filter.status = status;
  if (orderNumber) filter.orderNumber = orderNumber;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.json({ orders });
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw new HttpError('Invalid order id', 400);

  const order = await Order.findById(id).lean();
  if (!order) throw new HttpError('Order not found', 404);

  res.json({ order });
};

const createOrder = async (req, res) => {
  const { customerName, phone, outletId, items } = req.body;

  if (!customerName || !phone || !outletId) throw new HttpError('Missing required fields', 400);
  if (!isValidObjectId(outletId)) throw new HttpError('Invalid outletId', 400);

  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) throw new HttpError('Cart is empty', 400);

  const productIds = safeItems.map((i) => i.productId).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds }, outletId }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const normalizedItems = safeItems.map((i) => {
    const productId = String(i.productId || '');
    const product = byId.get(productId);
    if (!product) throw new HttpError('Invalid product in cart', 400, { productId });
    const quantity = Number(i.quantity || 0);
    if (!Number.isFinite(quantity) || quantity < 1) throw new HttpError('Invalid quantity', 400);
    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
    };
  });

  const totalAmount = normalizedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const order = await Order.create({
    customerName,
    phone,
    outletId,
    items: normalizedItems,
    totalAmount,
    status: 'Pending',
  });

  res.status(201).json({
    order: {
      _id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      outletId: order.outletId,
      createdAt: order.createdAt,
    },
  });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) throw new HttpError('Invalid order id', 400);
  if (!ORDER_STATUSES.includes(status)) throw new HttpError('Invalid status', 400);

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).lean();

  if (!order) throw new HttpError('Order not found', 404);

  res.json({ order });
};

module.exports = { listOrders, getOrderById, createOrder, updateOrderStatus };
