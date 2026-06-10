const express = require('express');
const {
  createAssignment,
  getAssignments,
  createLeaveRequest,
  getLeaveRequests,
  getClasses,
  getStudentsByClass,
  getImageKitAuth
} = require('../controllers/educatorController');
// Assuming we have some middleware to protect routes, but for now we will just use the routes.
// const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware if authController has protect
// router.use(protect);
// router.use(restrictTo('educator', 'super-admin'));

router.route('/assignments')
  .post(createAssignment)
  .get(getAssignments);

router.route('/leaves')
  .post(createLeaveRequest)
  .get(getLeaveRequests);

router.get('/classes/:educatorId', getClasses);
router.get('/students/:class/:section', getStudentsByClass);
router.get('/imagekit-auth', getImageKitAuth);

module.exports = router;
