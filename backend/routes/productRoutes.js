const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

module.exports = router;