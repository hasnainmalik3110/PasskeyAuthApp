// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');

// const app = express();
// app.use(cors()); // Open CORS for dev
// app.use(express.json());

// app.use('/auth', authRoutes);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('✅ Connected to MongoDB Atlas'))
//   .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// Importing required modules
require('dotenv').config(); // For loading environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Assuming the routes are in the `routes/auth.js` file
const app = express();

// CORS Configuration (Allow frontend from localhost:5173 in development)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.vercel.app' : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Allow credentials like cookies or authentication headers if needed
};

// Middleware Setup
app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(express.json()); // To parse JSON bodies in requests

// Use Routes
app.use('/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
