import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { Customer, Admin, ActivityLog } from '../models/index.js';
import { jwtConfig } from '../config/auth.js';
import logger from '../utils/logger.js';

/**
 * Generate JWT token
 */
const generateToken = (user, type) => {
    const payload = {
        id: user.id,
        email: user.email,
        type, // 'customer' or 'admin'
        ...(type === 'admin' && { role: user.role }),
    };

    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });
};

/**
 * Customer Registration
 * POST /api/auth/customer/register
 */
export const registerCustomer = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if email already exists
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email already registered' },
            });
        }

        // Create new customer
        const customer = await Customer.create({
            name,
            email,
            password,
            phone,
        });

        // Generate token
        const token = generateToken(customer, 'customer');

        // Log activity
        await ActivityLog.create({
            customer_id: customer.id,
            action: 'REGISTER',
            description: 'Customer registered successfully',
            ip_address: req.ip,
        });

        logger.info(`New customer registered: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                token,
                user: {
                    ...customer.toSafeObject(),
                    type: 'customer',
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Customer Login
 * POST /api/auth/customer/login
 */
export const loginCustomer = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find customer by email
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' },
            });
        }

        // Verify password
        const isPasswordValid = await customer.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' },
            });
        }

        // Generate token
        const token = generateToken(customer, 'customer');

        // Log activity
        await ActivityLog.create({
            customer_id: customer.id,
            action: 'LOGIN',
            description: 'Customer logged in',
            ip_address: req.ip,
        });

        logger.info(`Customer logged in: ${email}`);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    ...customer.toSafeObject(),
                    type: 'customer',
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin Login
 * POST /api/auth/admin/login
 */
export const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' },
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' },
            });
        }

        // Generate token
        const token = generateToken(admin, 'admin');

        logger.info(`Admin logged in: ${email} (${admin.role})`);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    ...admin.toSafeObject(),
                    type: 'admin',
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
    try {
        // Log activity for customers
        if (req.user.type === 'customer') {
            await ActivityLog.create({
                customer_id: req.user.id,
                action: 'LOGOUT',
                description: 'Customer logged out',
                ip_address: req.ip,
            });
        }

        logger.info(`User logged out: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        let user;

        if (req.user.type === 'customer') {
            user = await Customer.findByPk(req.user.id, {
                attributes: { exclude: ['password'] },
            });
        } else {
            user = await Admin.findByPk(req.user.id, {
                attributes: { exclude: ['password'] },
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' },
            });
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validation rules
 */
export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone number'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

export default {
    registerCustomer,
    loginCustomer,
    loginAdmin,
    logout,
    getCurrentUser,
    registerValidation,
    loginValidation,
};
