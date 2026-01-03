import express from 'express';
const router = express.Router();
import * as teacherController from '../controllers/teacherController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

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

export default router;
