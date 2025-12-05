import { Customer, Reservation, ActivityLog } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Get Customer Dashboard Stats
 * GET /api/customer/dashboard
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        // Get counts
        const totalReservations = await Reservation.count({
            where: { customer_id: customerId },
        });

        const activeReservations = await Reservation.count({
            where: {
                customer_id: customerId,
                status: ['pending', 'confirmed'],
            },
        });

        const completedReservations = await Reservation.count({
            where: {
                customer_id: customerId,
                status: 'completed',
            },
        });

        // Get recent reservations with table info
        const recentReservations = await Reservation.findAll({
            where: { customer_id: customerId },
            include: [
                {
                    association: 'table',
                    include: ['tableType'],
                },
                'promo',
                'payment',
            ],
            order: [['created_at', 'DESC']],
            limit: 5,
        });

        res.json({
            success: true,
            data: {
                stats: {
                    totalReservations,
                    activeReservations,
                    completedReservations,
                },
                recentReservations,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Customer Profile
 * GET /api/customer/profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: { message: 'Customer not found' },
            });
        }

        res.json({
            success: true,
            data: { customer },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Customer Profile
 * PUT /api/customer/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        const customer = await Customer.findByPk(req.user.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: { message: 'Customer not found' },
            });
        }

        customer.name = name || customer.name;
        customer.phone = phone || customer.phone;

        await customer.save();

        logger.info(`Customer profile updated: ${customer.email}`);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { customer: customer.toSafeObject() },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Activity Logs
 * GET /api/customer/activity
 */
export const getActivityLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const activities = await ActivityLog.findAll({
            where: { customer_id: req.user.id },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });

        const total = await ActivityLog.count({
            where: { customer_id: req.user.id },
        });

        res.json({
            success: true,
            data: {
                activities,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getDashboardStats,
    getProfile,
    updateProfile,
    getActivityLogs,
};
