const mongoose = require('mongoose');
const SchoolConfig = require('./models/SchoolConfig');
require('dotenv').config();

console.log("URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const config = await SchoolConfig.findOne({ configId: 'main' });
  if (config) {
    // We want to reset paidAmount for all students or just clear the studentFees map.
    // Let's reset the map to be safe.
    config.studentFees = new Map();
    await config.save();
    console.log('Successfully reset all student fees to 0');
  } else {
    console.log('No SchoolConfig found');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
