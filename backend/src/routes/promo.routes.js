import express from 'express';
import { body, param, query } from 'express-validator';
import {
    getAllPromos,
    getPromoById,
    createPromo,
    updatePromo,
    deletePromo,
    validatePromo,
    getPromoStats
} from '../controllers/promoController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { authenticate as auth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const createPromoValidation = [
    body('code')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('Code must be between 2 and 20 characters')
        .matches(/^[A-Z0-9]+$/i)
        .withMessage('Code can only contain letters and numbers'),
    body('discount_type')
        .isIn(['percentage', 'fixed'])
        .withMessage('Discount type must be either percentage or fixed'),
    body('discount_value')
        .isFloat({ min: 0 })
        .withMessage('Discount value must be a positive number'),
    body('min_hours')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum hours must be a non-negative integer'),
    body('valid_from')
        .isISO8601()
        .withMessage('Valid from must be a valid date'),
    body('valid_until')
        .isISO8601()
        .withMessage('Valid until must be a valid date'),
    body('max_uses')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Maximum uses must be a positive integer'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean')
];

const updatePromoValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid promo ID'),
    body('code')
        .optional()
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('Code must be between 2 and 20 characters')
        .matches(/^[A-Z0-9]+$/i)
        .withMessage('Code can only contain letters and numbers'),
    body('discount_type')
        .optional()
        .isIn(['percentage', 'fixed'])
        .withMessage('Discount type must be either percentage or fixed'),
    body('discount_value')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Discount value must be a positive number'),
    body('min_hours')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum hours must be a non-negative integer'),
    body('valid_from')
        .optional()
        .isISO8601()
        .withMessage('Valid from must be a valid date'),
    body('valid_until')
        .optional()
        .isISO8601()
        .withMessage('Valid until must be a valid date'),
    body('max_uses')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Maximum uses must be a positive integer'),
    body('current_uses')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current uses must be a non-negative integer'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean')
];

const getPromoValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid promo ID')
];

const validatePromoValidation = [
    query('code')
        .trim()
        .notEmpty()
        .withMessage('Promo code is required'),
    query('hours')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Hours must be a non-negative integer')
];

// Public routes (accessible to authenticated users)
router.get('/validate', validatePromoValidation, validate, auth, validatePromo);

// Admin-only routes
router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAllPromos);
router.get('/stats', getPromoStats);
router.get('/:id', getPromoValidation, validate, getPromoById);
router.post('/', createPromoValidation, validate, createPromo);
router.put('/:id', updatePromoValidation, validate, updatePromo);
router.delete('/:id', getPromoValidation, validate, deletePromo);

export default router;