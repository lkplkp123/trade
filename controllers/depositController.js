// controllers/depositController.js
const User = require('../models/User');

const staticCurrencyValues = {
  "BTC": 50000,
  "ETH": 3000,
  "LTC": 200,
  "XRP": 1,
  "DOGE": 0.05
};

// Deposit logic
const deposit = async (req, res) => {
  const { userId, currency, amount } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!staticCurrencyValues[currency]) {
    return res.status(400).json({ message: 'Invalid currency' });
  }

  user.balance[currency] = (user.balance[currency] || 0) + amount;

  try {
    await user.save();
    return res.status(200).json({
      message: 'Deposit successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error processing deposit' });
  }
};

// Withdraw logic
const withdraw = async (req, res) => {
  const { userId, currency, amount } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!staticCurrencyValues[currency]) {
    return res.status(400).json({ message: 'Invalid currency' });
  }

  if (user.balance[currency] < amount) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }

  user.balance[currency] -= amount;

  try {
    await user.save();
    return res.status(200).json({
      message: 'Withdrawal successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error processing withdrawal' });
  }
};

module.exports = {
  deposit,
  withdraw
};
