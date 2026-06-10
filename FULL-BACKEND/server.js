require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const educatorRoutes = require('./routes/educatorRoutes');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Force Node.js to use Google's Public DNS to fix SRV connection issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/educator', educatorRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

app.get('/api/imagekit/auth', (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } catch (error) {
    console.error('ImageKit Auth Error:', error);
    res.status(500).json({ error: 'Failed to generate ImageKit auth parameters' });
  }
});

// Database connection
const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
