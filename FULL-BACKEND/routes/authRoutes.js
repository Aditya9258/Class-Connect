const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

const otpController = require('../controllers/otpController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.protect, authController.logout);

// OTP Routes
router.post('/otp/generate', authController.protect, otpController.generateOTP);
router.post('/otp/verify', authController.protect, otpController.verifyOTP);
router.get('/otp/status', authController.protect, otpController.getOTPStatus);
router.post('/otp/disable', authController.protect, otpController.disableOTP);

module.exports = router;
