const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All routes here require Teacher role
router.use(requireAuth);
router.use(requireRole('teacher'));

// Teacher Management
router.post('/teachers', teacherController.createTeacher);

// Student Management
router.post('/students', teacherController.createStudent);
router.get('/students', teacherController.getAllStudents);
router.get('/students/:id', teacherController.getStudentById);
router.put('/students/:id', teacherController.updateStudent);
router.delete('/students/:id', teacherController.deleteStudent);

module.exports = router;
