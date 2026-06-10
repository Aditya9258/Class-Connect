const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all student routes
router.use(authController.protect);
router.use(authController.restrictTo('student', 'super-admin'));

router.get('/me', studentController.getMyProfile);
router.get('/me/exams', studentController.getMyExams);
router.get('/dashboard', studentController.getDashboard);
router.post('/pay-fee', studentController.payFee);

module.exports = router;
