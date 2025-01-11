// controllers/swapController.js
const User = require('../models/User');

const staticCurrencyValues = {
  "BTC": 50000,
  "ETH": 3000,
  "LTC": 200,
  "XRP": 1,
  "DOGE": 0.05
};

// Swap logic
const swap = async (req, res) => {
  const { userId, fromCurrency, toCurrency, amount } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!staticCurrencyValues[fromCurrency] || !staticCurrencyValues[toCurrency]) {
    return res.status(400).json({ message: 'Invalid currencies' });
  }

  if (user.balance[fromCurrency] < amount) {
    return res.status(400).json({ message: 'Insufficient funds for swap' });
  }

  // Calculate the equivalent amount in the target currency
  const fromCurrencyValueInUSD = staticCurrencyValues[fromCurrency];
  const toCurrencyValueInUSD = staticCurrencyValues[toCurrency];

  // Calculate the amount to transfer to the target currency
  const equivalentAmount = (amount * fromCurrencyValueInUSD) / toCurrencyValueInUSD;

  // Perform the swap (deduct from source currency, add to target currency)
  user.balance[fromCurrency] -= amount;
  user.balance[toCurrency] = (user.balance[toCurrency] || 0) + equivalentAmount;

  try {
    await user.save();
    return res.status(200).json({
      message: 'Swap successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error processing swap' });
  }
};

module.exports = {
  swap
};
