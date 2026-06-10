const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an assignment title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  class: {
    type: String,
    required: [true, 'Please specify the class'],
  },
  section: {
    type: String,
    required: [true, 'Please specify the section'],
  },
  subject: {
    type: String,
    required: [true, 'Please specify the subject'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Please specify a due date'],
  },
  attachmentUrl: {
    type: String,
    default: null,
  },
  educatorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Assignment must belong to an educator'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
