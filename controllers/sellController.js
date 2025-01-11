// controllers/sellController.js
const User = require('../models/User');

const staticCurrencyValues = {
  "BTC": 50000,
  "ETH": 3000,
  "LTC": 200,
  "XRP": 1,
  "DOGE": 0.05
};

// Sell logic - Seller sells cryptocurrency to another user
const sell = async (req, res) => {
  const { sellerId, buyerId, currency, amount } = req.body;

  const seller = await User.findById(sellerId);
  const buyer = await User.findById(buyerId);

  if (!seller || !buyer) {
    return res.status(404).json({ message: 'User(s) not found' });
  }

  if (!staticCurrencyValues[currency]) {
    return res.status(400).json({ message: 'Invalid currency' });
  }

  // Check if the seller has enough cryptocurrency to sell
  if (seller.balance[currency] < amount) {
    return res.status(400).json({ message: 'Seller has insufficient cryptocurrency' });
  }

  // Calculate the equivalent USD value for the cryptocurrency
  const currencyValueInUSD = staticCurrencyValues[currency];
  const amountInUSD = amount * currencyValueInUSD;

  // Update balances
  seller.balance[currency] -= amount;
  buyer.balance[currency] = (buyer.balance[currency] || 0) + amount;
  seller.balance["USD"] = (seller.balance["USD"] || 0) + amountInUSD;
  buyer.balance["USD"] = (buyer.balance["USD"] || 0) - amountInUSD;

  try {
    await seller.save();
    await buyer.save();

    return res.status(200).json({
      message: 'Sell successful',
      buyer: buyer,
      seller: seller,
      amountInUSD
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error processing sell' });
  }
};

module.exports = { sell };
