const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const EducatorProfile = require('../models/EducatorProfile');
const SchoolConfig = require('../models/SchoolConfig');
const LeaveRequest = require('../models/LeaveRequest');

exports.getDashboard = async (req, res) => {
  try {
    const students = await StudentProfile.find().populate('user', 'name email');
    const educators = await EducatorProfile.find().populate('user', 'name email');
    const leaveRequests = await LeaveRequest.find().populate('educatorId', 'name email').sort({ createdAt: -1 });
    
    let config = await SchoolConfig.findOne({ configId: 'main' });
    if (!config) {
      config = await SchoolConfig.create({ configId: 'main' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        students,
        educators,
        leaveRequests,
        classes: config.classes,
        announcements: config.announcements,
        timetables: config.timetables,
        facultyAttendance: config.facultyAttendance,
        facultySalaries: config.facultySalaries,
        classFees: config.classFees,
        studentFees: config.studentFees
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateSchoolConfig = async (req, res) => {
  try {
    const updates = req.body; // e.g. { facultyAttendance: {...} }
    
    let config = await SchoolConfig.findOne({ configId: 'main' });
    if (!config) {
      config = await SchoolConfig.create({ configId: 'main' });
    }

    // Merge updates
    Object.keys(updates).forEach(key => {
      config[key] = updates[key];
      config.markModified(key); // Crucial for Mixed types like Array/Object
    });

    await config.save();
    
    res.status(200).json({ status: 'success', data: config });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const student = await StudentProfile.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    const updateData = { status };
    if (status === 'Rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!leave) {
      return res.status(404).json({ status: 'fail', message: 'Leave request not found' });
    }

    res.status(200).json({ status: 'success', data: leave });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.deleteEducator = async (req, res) => {
  try {
    const educatorProfile = await EducatorProfile.findById(req.params.id);
    if (!educatorProfile) {
      return res.status(404).json({ status: 'fail', message: 'Educator not found' });
    }
    
    // Also delete the associated User account
    if (educatorProfile.user) {
      await User.findByIdAndDelete(educatorProfile.user);
    }
    
    // Delete EducatorProfile
    await EducatorProfile.findByIdAndDelete(req.params.id);
    
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateEducator = async (req, res) => {
  try {
    const { name, email, team, mobile, aadhaar, dob, address, qualification } = req.body;
    
    const educatorProfile = await EducatorProfile.findById(req.params.id);
    if (!educatorProfile) {
      return res.status(404).json({ status: 'fail', message: 'Educator not found' });
    }

    if (educatorProfile.user) {
      await User.findByIdAndUpdate(educatorProfile.user, { name, email });
    }

    const updatedProfile = await EducatorProfile.findByIdAndUpdate(
      req.params.id,
      {
        subjectSpecialization: team,
        mobileNumber: mobile,
        aadhaarNumber: aadhaar,
        dateOfBirth: dob,
        residentialAddress: address,
        highestQualification: qualification
      },
      { new: true }
    );

    res.status(200).json({ status: 'success', data: updatedProfile });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
