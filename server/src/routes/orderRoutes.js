const express = require('express');
const {
  listOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', listOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
