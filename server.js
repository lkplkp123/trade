// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

// Initialize app
const app = express();

// Connect to DB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/swap', require('./routes/swap'));  // Add this line for the swap route
app.use('/api/buy', require('./routes/buy'));  // Add this line for buy
app.use('/api/sell', require('./routes/sell')); // Add this line for sell


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
