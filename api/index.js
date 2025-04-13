// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// })); // Open CORS for dev
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

const express = require('express');
const app = express();

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://passkey-auth-app.vercel.app']; // Replace with your frontend URLs
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());
app.use('/auth', require('../routes/auth'));

// ❌ DO NOT DO THIS ON VERCEL
// app.listen(PORT, () => console.log('Running on port', PORT));

// ✅ INSTEAD: export the app for Vercel
module.exports = app;
