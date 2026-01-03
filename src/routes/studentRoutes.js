const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All routes here require Student role
router.use(requireAuth);
router.use(requireRole('student'));

router.get('/me', studentController.getMe);
router.patch('/me', studentController.updateMe);

module.exports = router;
