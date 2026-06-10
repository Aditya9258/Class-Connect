const StudentProfile = require('../models/StudentProfile');
const SchoolConfig = require('../models/SchoolConfig');
const EducatorProfile = require('../models/EducatorProfile');

exports.getMyProfile = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student profile not found' });
    }
    res.status(200).json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let config = await SchoolConfig.findOne({ configId: 'main' });
    if (!config) {
      config = await SchoolConfig.create({ configId: 'main' });
    }

    const educators = await EducatorProfile.find().populate('user', 'name');
    const mappedEducators = educators.map(ed => ({
      id: ed._id,
      name: ed.user?.name || 'Unknown'
    }));

    res.status(200).json({
      status: 'success',
      data: {
        announcements: config.announcements,
        classFees: config.classFees,
        studentFees: config.studentFees,
        timetables: config.timetables || [],
        educators: mappedEducators
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getMyExams = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student profile not found' });
    }
    res.status(200).json({ status: 'success', data: student.exams });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.payFee = async (req, res) => {
  try {
    const { amount, label } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ status: 'fail', message: 'Invalid payment amount' });
    }

    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student profile not found' });
    }

    let config = await SchoolConfig.findOne({ configId: 'main' });
    if (!config) {
      config = await SchoolConfig.create({ configId: 'main' });
    }

    const studentId = student._id.toString();
    const currentFees = config.studentFees && config.studentFees[studentId] 
      ? config.studentFees[studentId] 
      : { paidAmount: '0', status: 'Unpaid' };

    const newPaidAmount = Number(currentFees.paidAmount) + Number(amount);
    
    // Calculate new status
    let newStatus = 'Unpaid';
    
    // Extract class from course string like "Class 10" or "Class 10 - A"
    const getStudentClass = (courseStr) => {
      if (!courseStr) return '';
      const match = courseStr.match(/Class\s*(\d+)/i);
      if (match) return match[1];
      const parts = courseStr.split('-');
      if (parts.length > 0) return parts[0].trim().replace(/Class/i, '').trim();
      return '';
    };
    
    const sClass = getStudentClass(student.course || student.class);
    const totalFeeStr = config.classFees ? config.classFees[sClass] : '0';
    const totalFee = Number(totalFeeStr) || 0;

    if (totalFee > 0) {
      if (newPaidAmount >= totalFee) {
        newStatus = 'Fully Paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'Partial';
      }
    } else {
      newStatus = newPaidAmount > 0 ? 'Partial' : 'Unpaid';
    }

    if (!config.studentFees) {
      config.studentFees = {};
    }
    
    config.studentFees[studentId] = {
      paidAmount: newPaidAmount.toString(),
      status: newStatus
    };
    
    config.markModified('studentFees');
    await config.save();

    // Create payment history record
    const receiptId = `RF${10000 + Math.floor(Math.random() * 90000)}`;
    student.paymentHistory.push({
      receiptId,
      amount: Number(amount),
      payDate: new Date(),
      label: label || 'Tuition Fee',
      method: 'Card'
    });
    await student.save();

    res.status(200).json({ status: 'success', message: 'Payment successful', data: config.studentFees[studentId] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
