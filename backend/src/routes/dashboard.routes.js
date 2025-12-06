import express from 'express';
import { getDashboardStats, getTableStatus } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticate);
router.use(requireAdmin);

// Routes
router.get('/stats', getDashboardStats);
router.get('/table-status', getTableStatus);

export default router;