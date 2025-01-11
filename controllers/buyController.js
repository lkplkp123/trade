// controllers/buyController.js
const User = require('../models/User');

const staticCurrencyValues = {
  "BTC": 50000,
  "ETH": 3000,
  "LTC": 200,
  "XRP": 1,
  "DOGE": 0.05
};

// Buy logic - Buyer buys cryptocurrency
const buy = async (req, res) => {
  const { buyerId, sellerId, currency, amountInUSD } = req.body;

  const buyer = await User.findById(buyerId);
  const seller = await User.findById(sellerId);

  console.log(buyer,"buyer")
  console.log(seller,"seller")


  if (!buyer || !seller) {
    return res.status(404).json({ message: 'User(s) not found' });
  }

  if (!staticCurrencyValues[currency]) {
    return res.status(400).json({ message: 'Invalid currency' });
  }

  // Calculate the amount of cryptocurrency the buyer is getting
  const currencyValueInUSD = staticCurrencyValues[currency];
  const amountOfCurrencyToBuy = amountInUSD / currencyValueInUSD;

  // Check if the seller has enough of the cryptocurrency
  if (seller.balance[currency] < amountOfCurrencyToBuy) {
    return res.status(400).json({ message: 'Seller has insufficient balance' });
  }

  // Update balances
  buyer.balance[currency] = (buyer.balance[currency] || 0) + amountOfCurrencyToBuy;
  seller.balance[currency] -= amountOfCurrencyToBuy;
  buyer.balance["USD"] = (buyer.balance["USD"] || 0) - amountInUSD;
  seller.balance["USD"] = (seller.balance["USD"] || 0) + amountInUSD;

  try {
    await buyer.save();
    await seller.save();

    return res.status(200).json({
      message: 'Buy successful',
      buyer: buyer,
      seller: seller
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error processing buy' });
  }
};

module.exports = { buy };
