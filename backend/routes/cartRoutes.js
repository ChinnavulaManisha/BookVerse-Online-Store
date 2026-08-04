const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.post('/', auth, addToCart);
router.get('/', auth, getCart);
router.put('/:id', auth, updateCartItem);
router.delete('/:id', auth, removeFromCart);

module.exports = router;
