import express from 'express';

import * as studentController from '../controllers/studentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();
// All routes here require Student role
router.use(requireAuth);
router.use(requireRole('student'));

router.get('/me', studentController.getMe);
router.patch('/me', studentController.updateMe);

export default router;
