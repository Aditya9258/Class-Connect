const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const StudentProfile = require('./models/StudentProfile');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const students = await StudentProfile.find().populate('user', 'name email');
  console.log('Students in DB:', students);
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
