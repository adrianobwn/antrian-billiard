import { Customer, Reservation, ActivityLog, Table, TableType, Payment, Promo } from '../models/index.js';
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

        // Get reservation stats
        const totalReservations = await Reservation.count({
            where: { customer_id: req.user.id }
        });

        const completedReservations = await Reservation.count({
            where: {
                customer_id: req.user.id,
                status: 'completed'
            }
        });

        res.json({
            success: true,
            data: {
                customer: {
                    ...customer.toJSON(),
                    total_reservations: totalReservations,
                    completed_reservations: completedReservations
                }
            },
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

/**
 * Get Customer Reservations with pagination
 * GET /api/customer/reservations
 */
export const getReservations = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const customerId = req.user.id;

        const whereClause = { customer_id: customerId };
        if (status) {
            whereClause.status = status;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: reservations } = await Reservation.findAndCountAll({
            where: whereClause,
            include: [
                {
                    association: 'table',
                    include: ['tableType'],
                },
                'promo',
                'payment',
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.json({
            success: true,
            data: {
                reservations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel Customer Reservation
 * PUT /api/customer/reservations/:id/cancel
 */
export const cancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerId = req.user.id;

        const reservation = await Reservation.findOne({
            where: {
                id,
                customer_id: customerId,
            },
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: { message: 'Reservation not found' },
            });
        }

        if (reservation.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                error: { message: 'Reservation is already cancelled' },
            });
        }

        if (reservation.status === 'completed') {
            return res.status(400).json({
                success: false,
                error: { message: 'Cannot cancel a completed reservation' },
            });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        // Log the activity
        await ActivityLog.create({
            customer_id: customerId,
            action: 'reservation_cancelled',
            description: `Cancelled reservation #${reservation.id}`,
            ip_address: req.ip,
        });

        logger.info(`Customer cancelled reservation: ${reservation.id}`);

        res.json({
            success: true,
            message: 'Reservation cancelled successfully',
            data: { reservation },
        });
    } catch (error) {
        next(error);
    }
};




/**
 * Change Password
 * PUT /api/customer/change-password
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const customer = await Customer.findByPk(req.user.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: { message: 'Customer not found' },
            });
        }

        const isMatch = await customer.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: { message: 'Current password incorrect' },
            });
        }

        customer.password = newPassword;
        await customer.save();

        logger.info(`Customer changed password: ${customer.email}`);

        res.json({
            success: true,
            message: 'Password changed successfully',
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
    getReservations,
    cancelReservation,
    changePassword,
};
