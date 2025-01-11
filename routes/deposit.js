// routes/deposit.js
const express = require('express');
const { deposit, withdraw } = require('../controllers/depositController');
const router = express.Router();

// Deposit route
router.post('/deposit', deposit);

// Withdraw route
router.post('/withdraw', withdraw);

module.exports = router;
