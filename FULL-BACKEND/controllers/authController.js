const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const EducatorProfile = require('../models/EducatorProfile');
const crypto = require('crypto');

const signAccessToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d' // Long-lived for admin dashboard
  });
};

const signRefreshToken = id => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d' // Long-lived
  });
};

const createSendTokens = async (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Store refresh token in user document
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Remove password and token from output
  user.password = undefined;
  user.refreshToken = undefined;

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt_refresh', refreshToken, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, adminCreate, course, session, status, registrationNo } = req.body;
    
    if (!['student', 'educator', 'super-admin'].includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role. Must be student, educator, or super-admin.'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role
    });

    if (role === 'student') {
      await StudentProfile.create({
        user: newUser._id,
        course: course || 'Unassigned',
        session: session || '2026-2027',
        status: status || 'Pending',
        registrationNo: registrationNo
      });
    } else if (role === 'educator') {
      await EducatorProfile.create({
        user: newUser._id,
        subjectSpecialization: req.body.subjectSpecialization || 'Unassigned',
        dateOfBirth: req.body.dateOfBirth,
        aadhaarNumber: req.body.aadhaarNumber,
        mobileNumber: req.body.mobileNumber,
        residentialAddress: req.body.residentialAddress,
        highestQualification: req.body.highestQualification,
        salary: req.body.salary,
        assignments: req.body.assignments || []
      });
    }

    if (adminCreate) {
      newUser.password = undefined;
      return res.status(201).json({ status: 'success', data: { user: newUser } });
    }

    await createSendTokens(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    if (role && user.role !== role && user.role !== 'super-admin') {
      return res.status(403).json({
        status: 'fail',
        message: `Account exists but is not registered as a ${role}`
      });
    }

    await createSendTokens(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt_refresh;
    if (!refreshToken) {
      return res.status(401).json({ status: 'fail', message: 'No refresh token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ status: 'fail', message: 'Invalid refresh token.' });
    }

    // Issue new access token
    const accessToken = signAccessToken(user._id);

    res.status(200).json({
      status: 'success',
      accessToken
    });

  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid refresh token or expired.' });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }
    res.cookie('jwt_refresh', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists.' });
    }

    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid token or expired.' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
