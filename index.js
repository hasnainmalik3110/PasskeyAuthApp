const express = require('express');
const app = express();

// Set CORS headers manually
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://passkey-auth-app.vercel.app']; // Add your frontend URL(s) here
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Your routes and other middleware...
app.use(express.json());
app.use('/auth', require('./routes/auth')); // Update the path to your routes as needed

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
