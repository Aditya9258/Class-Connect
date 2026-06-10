const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Student profile must belong to a user']
  },
  registrationNo: {
    type: String,
    unique: true,
    sparse: true
  },
  course: {
    type: String,
    required: [true, 'Student must have a class/course assigned']
  },
  session: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Inactive'],
    default: 'Pending'
  },
  progress: {
    type: Number,
    default: 0
  },
  cgpa: {
    type: Number,
    default: 0
  },
  attendance: {
    type: Number,
    default: 0
  },
  assignedEducatorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  exams: {
    type: Map,
    of: [{
      name: String,
      marks: Number,
      total: Number
    }],
    default: {}
  },
  performanceMetrics: [{
    label: String,
    value: Number
  }],
  feeInstallments: [{
    label: String,
    due: String,
    amount: Number,
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Edit'],
      default: 'Pending'
    }
  }],
  paymentHistory: [{
    receiptId: String,
    amount: Number,
    payDate: Date,
    label: String,
    method: { type: String, default: 'Card' }
  }]
}, {
  timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
module.exports = StudentProfile;
