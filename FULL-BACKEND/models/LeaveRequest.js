const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  educatorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Leave request must belong to an educator'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify an end date'],
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for leave'],
  },
  isSickLeave: {
    type: Boolean,
    default: false,
  },
  medicalRecordUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
