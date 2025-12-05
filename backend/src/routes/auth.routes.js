import express from 'express';
import {
    registerCustomer,
    loginCustomer,
    loginAdmin,
    logout,
    getCurrentUser,
    registerValidation,
    loginValidation,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * Authentication Routes
 */

// Customer registration
router.post('/customer/register', registerValidation, validate, registerCustomer);

// Customer login
router.post('/customer/login', loginValidation, validate, loginCustomer);

// Admin login
router.post('/admin/login', loginValidation, validate, loginAdmin);

// Logout (requires authentication)
router.post('/logout', authenticate, logout);

// Get current user (requires authentication)
router.get('/me', authenticate, getCurrentUser);

export default router;
