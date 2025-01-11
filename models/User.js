// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: {
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 },
    LTC: { type: Number, default: 0 },
    XRP: { type: Number, default: 0 },
    DOGE: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('User', userSchema);
