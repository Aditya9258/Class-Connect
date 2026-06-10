const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('DB Connected. Removing test students...');

  // Find users with 'Test Student' in name
  const testUsers = await User.find({ name: /Test Student/i });
  
  if (testUsers.length === 0) {
    console.log('No test students found.');
    process.exit();
  }

  const userIds = testUsers.map(u => u._id);
  
  const deletedProfiles = await StudentProfile.deleteMany({ user: { $in: userIds } });
  const deletedUsers = await User.deleteMany({ _id: { $in: userIds } });

  console.log(`Deleted ${deletedProfiles.deletedCount} StudentProfiles.`);
  console.log(`Deleted ${deletedUsers.deletedCount} Users.`);
  process.exit();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
