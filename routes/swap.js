// routes/swap.js
const express = require('express');
const { swap } = require('../controllers/swapController');
const router = express.Router();

// Swap route
router.post('/swap', swap);

module.exports = router;
