import express from 'express';
import { query } from 'express-validator';
import {
    getRevenueReports,
    getTablePerformanceReports,
    getCustomerAnalytics,
    getPromoEffectivenessReports,
    getHourlyAnalytics
} from '../controllers/reportsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticate);
router.use(requireAdmin);

// Validation rules
const dateRangeValidation = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
];

// Routes
router.get('/revenue', dateRangeValidation, validate, getRevenueReports);
router.get('/table-performance', dateRangeValidation, validate, getTablePerformanceReports);
router.get('/customer-analytics', dateRangeValidation, validate, getCustomerAnalytics);
router.get('/promo-effectiveness', getPromoEffectivenessReports);
router.get('/hourly-analytics', dateRangeValidation, validate, getHourlyAnalytics);

export default router;