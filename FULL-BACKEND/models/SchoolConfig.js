const mongoose = require('mongoose');

const schoolConfigSchema = new mongoose.Schema({
  configId: { type: String, default: 'main', unique: true },
  classes: { type: Array, default: [] },
  announcements: { type: Array, default: [] },
  timetables: { type: Array, default: [] },
  facultyAttendance: { type: Object, default: {} },
  facultySalaries: { type: Object, default: {} },
  classFees: { type: Object, default: {} },
  studentFees: { type: Object, default: {} },
});

const SchoolConfig = mongoose.model('SchoolConfig', schoolConfigSchema);
module.exports = SchoolConfig;
