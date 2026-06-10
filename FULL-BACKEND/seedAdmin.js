const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

mongoose.connect(process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)).then(async () => {
  const admin = await User.findOne({ role: 'super-admin' });
  if (!admin) {
    console.log('No super-admin found, creating one...');
    await User.create({ name: 'Admin', email: 'admin', password: 'secure778899', role: 'super-admin' });
    console.log('Admin created.');
  } else {
    console.log('Admin exists:', admin.email);
  }
  process.exit();
});
