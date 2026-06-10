const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'educator', 'super-admin'],
    required: [true, 'Please specify if the user is a student, educator, or super-admin'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  otpEnabled: {
    type: Boolean,
    default: false
  },
  otpSecret: {
    type: String,
    select: false
  },
  // Educator specific fields
  permanentClasses: [{
    class: String,
    section: String,
    subject: String
  }],
  temporaryClasses: [{
    class: String,
    section: String,
    subject: String,
    date: Date,
    period: String
  }]
});

// Encrypt password before saving
userSchema.pre('save', async function() {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return;

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to check if entered password matches hashed password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
