const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const EducatorProfile = require('./models/EducatorProfile');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('DB Connected. Syncing profiles...');

  // Sync Students
  const students = await User.find({ role: 'student' });
  let studentCount = 0;
  for (const student of students) {
    const existing = await StudentProfile.findOne({ user: student._id });
    if (!existing) {
      await StudentProfile.create({
        user: student._id,
        course: 'Class 10-A', // Default or parse if they had it somewhere else
        session: '2026-2027',
        status: 'Active'
      });
      studentCount++;
    }
  }

  // Sync Educators
  const educators = await User.find({ role: 'educator' });
  let educatorCount = 0;
  for (const educator of educators) {
    const existing = await EducatorProfile.findOne({ user: educator._id });
    if (!existing) {
      await EducatorProfile.create({
        user: educator._id,
        subjectSpecialization: 'Unassigned'
      });
      educatorCount++;
    }
  }

  console.log(`Successfully created ${studentCount} missing StudentProfiles.`);
  console.log(`Successfully created ${educatorCount} missing EducatorProfiles.`);
  process.exit();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
