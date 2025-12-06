import express from 'express';
import { body, param } from 'express-validator';
import {
    getAllTableTypes,
    getTableTypeById,
    createTableType,
    updateTableType,
    deleteTableType
} from '../controllers/tableTypeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticate);
router.use(requireAdmin);

// Validation rules
const createTableTypeValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage('Name can only contain letters, numbers, and spaces'),
    body('hourly_rate')
        .isFloat({ min: 0 })
        .withMessage('Hourly rate must be a positive number'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Color must be a valid hex color code'),
    body('icon')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Icon must not exceed 50 characters')
];

const updateTableTypeValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid table type ID'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage('Name can only contain letters, numbers, and spaces'),
    body('hourly_rate')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Hourly rate must be a positive number'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Color must be a valid hex color code'),
    body('icon')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Icon must not exceed 50 characters'),
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean')
];

const getTableTypeValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid table type ID')
];

// Routes
router.get('/', getAllTableTypes);
router.get('/:id', getTableTypeValidation, validate, getTableTypeById);
router.post('/', createTableTypeValidation, validate, createTableType);
router.put('/:id', updateTableTypeValidation, validate, updateTableType);
router.delete('/:id', getTableTypeValidation, validate, deleteTableType);

export default router;