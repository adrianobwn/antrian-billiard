import express from 'express';
import { body } from 'express-validator';
import {
    getDashboardStats,
    getProfile,
    updateProfile,
    getActivityLogs,
    getReservations,
    cancelReservation,
    changePassword,
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

// Change Password
router.put('/change-password',
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    ],
    validate,
    changePassword
);

// Activity logs
router.get('/activity', getActivityLogs);

// Reservations
router.get('/reservations', getReservations);
router.put('/reservations/:id/cancel', cancelReservation);

export default router;

