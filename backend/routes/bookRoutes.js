const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook, getCategories } = require('../controllers/bookController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getBooks);
router.get('/categories/list', getCategories);
router.get('/:id', getBookById);

// Admin routes
router.post('/', auth, admin, upload.single('image'), createBook);
router.put('/:id', auth, admin, upload.single('image'), updateBook);
router.delete('/:id', auth, admin, deleteBook);

module.exports = router;
