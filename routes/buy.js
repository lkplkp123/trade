// routes/buy.js
const express = require('express');
const { buy } = require('../controllers/buyController');
const router = express.Router();

// Buy route
router.post('/buy', buy);

module.exports = router;
