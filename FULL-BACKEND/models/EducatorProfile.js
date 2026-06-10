const mongoose = require('mongoose');

const educatorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Educator profile must belong to a user']
  },
  subjectSpecialization: String,
  dateOfBirth: Date,
  aadhaarNumber: String,
  mobileNumber: String,
  residentialAddress: String,
  highestQualification: String,
  qualificationDocument: String,
  salary: {
    type: Number,
    default: 0
  },
  assignments: [{
    class: String,
    section: String,
    subject: String
  }],
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half-day'],
      default: 'Present'
    }
  }],
  salaryPayments: [{
    month: String,
    status: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending'
    },
    amount: Number,
    datePaid: Date
  }]
}, {
  timestamps: true
});

const EducatorProfile = mongoose.model('EducatorProfile', educatorProfileSchema);
module.exports = EducatorProfile;
