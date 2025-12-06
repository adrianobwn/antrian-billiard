import express from 'express';
import authRoutes from './auth.routes.js';
import customerRoutes from './customer.routes.js';
import reservationRoutes from './reservation.routes.js';
import adminRoutes from './admin.routes.js';
import tablesRoutes from './tables.routes.js';
import tableTypeRoutes from './tableType.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import promoRoutes from './promo.routes.js';
import reportsRoutes from './reports.routes.js';

const router = express.Router();

/**
 * API Routes Index
 */

router.use('/auth', authRoutes);
router.use('/customer', customerRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);
router.use('/tables', tablesRoutes);
router.use('/table-types', tableTypeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/promos', promoRoutes);
router.use('/reports', reportsRoutes);

// API root
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Billiard Reservation API v1.0',
        endpoints: {
            auth: '/api/auth',
            customer: '/api/customer',
            admin: '/api/admin',
            reservations: '/api/reservations',
            tables: '/api/tables',
            tableTypes: '/api/table-types',
            promos: '/api/promos',
            reports: '/api/reports',
        },
    });
});

export default router;
