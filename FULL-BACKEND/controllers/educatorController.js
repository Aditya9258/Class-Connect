const Assignment = require('../models/Assignment');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy'
});

// --- IMAGEKIT AUTH ---
exports.getImageKitAuth = (req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authenticationParameters);
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// --- ASSIGNMENTS ---
exports.createAssignment = async (req, res) => {
  try {
    const newAssignment = await Assignment.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { assignment: newAssignment }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { educatorId } = req.query;
    const filter = educatorId ? { educatorId } : {};
    
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: assignments.length,
      data: { assignments }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// --- LEAVE REQUESTS ---
exports.createLeaveRequest = async (req, res) => {
  try {
    const newLeave = await LeaveRequest.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { leaveRequest: newLeave }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getLeaveRequests = async (req, res) => {
  try {
    const { educatorId } = req.query;
    const filter = educatorId ? { educatorId } : {};
    
    const leaves = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: leaves.length,
      data: { leaves }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// --- CLASSES & STUDENTS ---
exports.getClasses = async (req, res) => {
  try {
    const educator = await User.findById(req.params.educatorId);
    if (!educator || educator.role !== 'educator') {
      return res.status(404).json({ status: 'fail', message: 'Educator not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        permanentClasses: educator.permanentClasses || [],
        temporaryClasses: educator.temporaryClasses || []
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStudentsByClass = async (req, res) => {
  try {
    // Usually students would be in a Student model. Since they are currently in the User model or mock data:
    // If you store student details in User:
    // const students = await User.find({ role: 'student', class: req.params.class, section: req.params.section });
    
    // For now, returning an empty array to be handled by frontend mock if backend student model doesn't have class/section fields yet
    res.status(200).json({
      status: 'success',
      data: { students: [] }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
