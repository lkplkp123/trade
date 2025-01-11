// routes/sell.js
const express = require('express');
const { sell } = require('../controllers/sellController');
const router = express.Router();

// Sell route
router.post('/sell', sell);

module.exports = router;
