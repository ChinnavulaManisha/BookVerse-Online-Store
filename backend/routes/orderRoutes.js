const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, getAllUsers } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/users/all', auth, admin, getAllUsers);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, admin, updateOrderStatus);
router.get('/', auth, admin, getAllOrders);

module.exports = router;
