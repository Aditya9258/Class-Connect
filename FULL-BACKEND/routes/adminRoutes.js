const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all admin routes and restrict to 'super-admin'
router.use(authController.protect);
router.use(authController.restrictTo('super-admin'));

router.get('/dashboard', adminController.getDashboard);
router.patch('/config', adminController.updateSchoolConfig);
router.patch('/students/:id/status', adminController.updateStudentStatus);
router.patch('/leaves/:id/status', adminController.updateLeaveRequestStatus);
router.patch('/educators/:id', adminController.updateEducator);
router.delete('/educators/:id', adminController.deleteEducator);

module.exports = router;
