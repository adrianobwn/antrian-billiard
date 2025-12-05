import express from 'express';
import { body } from 'express-validator';
import {
    getDashboardStats,
    getProfile,
    updateProfile,
    getActivityLogs,
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * All customer routes require authentication
 */
router.use(authenticate);

// Ensure customer type
router.use((req, res, next) => {
    if (req.user.type !== 'customer') {
        return res.status(403).json({
            success: false,
            error: { message: 'Access denied. Customer account required.' },
        });
    }
    next();
});

/**
 * Customer Routes
 */

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Profile
router.get('/profile', getProfile);

const updateProfileValidation = [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone').optional().matches(/^[0-9+\-\s()]+$/),
];

router.put('/profile', updateProfileValidation, validate, updateProfile);

// Activity logs
router.get('/activity', getActivityLogs);

export default router;
