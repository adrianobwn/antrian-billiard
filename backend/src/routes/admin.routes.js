import express from 'express';
import {
    getDashboardStats,
    getTableStatus,
    getAllTables,
    getTableById,
    createTable,
    updateTable,
    deleteTable,
    getAllTableTypes,
    createTableType,
    updateTableType,
    deleteTableType,
    getAllPromos,
    createPromo,
    updatePromo,
    deletePromo,
    validatePromo,
    getAllAdmins,
    getAdminById,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    tableValidation,
    tableTypeValidation,
    promoValidation,
    adminUserValidation,
    adminUserUpdateValidation,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * All admin routes require authentication and admin role
 */
router.use(authenticate);
router.use(requireAdmin);

/**
 * Dashboard Routes
 */
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/table-status', getTableStatus);

/**
 * Table Management Routes
 */
router.get('/tables', getAllTables);
router.get('/tables/:id', getTableById);
router.post('/tables', tableValidation, validate, createTable);
router.put('/tables/:id', tableValidation, validate, updateTable);
router.delete('/tables/:id', deleteTable);

/**
 * Table Type Management Routes
 */
router.get('/table-types', getAllTableTypes);
router.post('/table-types', tableTypeValidation, validate, createTableType);
router.put('/table-types/:id', tableTypeValidation, validate, updateTableType);
router.delete('/table-types/:id', deleteTableType);

/**
 * Promo Management Routes
 */
router.get('/promos', getAllPromos);
router.post('/promos', promoValidation, validate, createPromo);
router.put('/promos/:id', promoValidation, validate, updatePromo);
router.delete('/promos/:id', deletePromo);
router.post('/promos/validate', validatePromo);

/**
 * Admin User Management Routes (Super Admin only)
 */
router.get('/users', requireSuperAdmin, getAllAdmins);
router.get('/users/:id', requireSuperAdmin, getAdminById);
router.post('/users', requireSuperAdmin, adminUserValidation, validate, createAdminUser);
router.put('/users/:id', requireSuperAdmin, adminUserUpdateValidation, validate, updateAdminUser);
router.delete('/users/:id', requireSuperAdmin, deleteAdminUser);

export default router;
