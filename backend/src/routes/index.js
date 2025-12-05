import express from 'express';
import authRoutes from './auth.routes.js';
import customerRoutes from './customer.routes.js';
import reservationRoutes from './reservation.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

/**
 * API Routes Index
 */

router.use('/auth', authRoutes);
router.use('/customer', customerRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);

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
        },
    });
});

export default router;
