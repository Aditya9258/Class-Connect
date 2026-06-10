const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const StudentProfile = require('./models/StudentProfile');

mongoose.connect(process.env.MONGODB_URI, {
}).then(async () => {
  console.log('Connected to DB');
  
  const students = await StudentProfile.find({});
  for (let s of students) {
    if (!s.registrationNo || !s.registrationNo.startsWith('STU-')) {
      // Use the profile ID as the consistent base for older students
      const rawId = s._id.toString();
      const digits = rawId.replace(/[^0-9]/g, '');
      let newId;
      if (digits.length >= 8) {
        newId = `STU-${digits.substring(0, 8)}`;
      } else {
        newId = `STU-${(rawId.toUpperCase() + '12345678').replace(/[^0-9A-Z]/g, '').substring(0, 8)}`;
      }
      
      s.registrationNo = newId;
      await s.save();
      console.log(`Updated student ${s._id} to have registrationNo: ${newId}`);
    }
  }
  
  console.log('Successfully fixed all student IDs');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
