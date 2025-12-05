import { Op } from 'sequelize';
import { body } from 'express-validator';
import { Reservation, Table, TableType, Customer, Promo, Payment, ActivityLog } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Get all reservations (filtered by user type)
 * GET /api/reservations
 */
export const getAllReservations = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const where = {};

        // Customers can only see their own reservations
        if (req.user.type === 'customer') {
            where.customer_id = req.user.id;
        }

        // Filter by status if provided
        if (status) {
            where.status = status;
        }

        const reservations = await Reservation.findAll({
            where,
            include: [
                {
                    association: 'customer',
                    attributes: ['id', 'name', 'email', 'phone'],
                },
                {
                    association: 'table',
                    include: ['tableType'],
                },
                'promo',
                'payment',
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });

        const total = await Reservation.count({ where });

        res.json({
            success: true,
            data: {
                reservations,
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
 * Get reservation by ID
 * GET /api/reservations/:id
 */
export const getReservationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id, {
            include: [
                {
                    association: 'customer',
                    attributes: ['id', 'name', 'email', 'phone'],
                },
                {
                    association: 'table',
                    include: ['tableType'],
                },
                'promo',
                'payment',
            ],
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: { message: 'Reservation not found' },
            });
        }

        // Customers can only view their own reservations
        if (req.user.type === 'customer' && reservation.customer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: { message: 'Access denied' },
            });
        }

        res.json({
            success: true,
            data: { reservation },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Check table availability
 * POST /api/reservations/check-availability
 */
export const checkAvailability = async (req, res, next) => {
    try {
        const { table_id, start_time, end_time } = req.body;

        const startTime = new Date(start_time);
        const endTime = new Date(end_time);

        // Check if table exists and is available
        const table = await Table.findByPk(table_id, {
            include: ['tableType'],
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table not found' },
            });
        }

        if (table.status !== 'available') {
            return res.json({
                success: true,
                data: {
                    available: false,
                    reason: `Table is currently ${table.status}`,
                },
            });
        }

        // Check for overlapping reservations
        const overlapping = await Reservation.count({
            where: {
                table_id,
                status: ['pending', 'confirmed'],
                [Op.or]: [
                    {
                        start_time: {
                            [Op.between]: [startTime, endTime],
                        },
                    },
                    {
                        end_time: {
                            [Op.between]: [startTime, endTime],
                        },
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: startTime } },
                            { end_time: { [Op.gte]: endTime } },
                        ],
                    },
                ],
            },
        });

        const available = overlapping === 0;

        res.json({
            success: true,
            data: {
                available,
                table,
                ...(available && {
                    estimatedCost: calculateCost(
                        table.tableType.hourly_rate,
                        (endTime - startTime) / (1000 * 60 * 60)
                    ),
                }),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create reservation
 * POST /api/reservations
 */
export const createReservation = async (req, res, next) => {
    try {
        const { table_id, start_time, end_time, promo_code, notes } = req.body;
        const customer_id = req.user.id;

        const startTime = new Date(start_time);
        const endTime = new Date(end_time);
        const durationHours = (endTime - startTime) / (1000 * 60 * 60);

        // Validate duration
        if (durationHours < 0.5) {
            return res.status(400).json({
                success: false,
                error: { message: 'Minimum booking duration is 30 minutes' },
            });
        }

        // Get table with type
        const table = await Table.findByPk(table_id, {
            include: ['tableType'],
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table not found' },
            });
        }

        // Check availability
        const overlapping = await Reservation.count({
            where: {
                table_id,
                status: ['pending', 'confirmed'],
                [Op.or]: [
                    { start_time: { [Op.between]: [startTime, endTime] } },
                    { end_time: { [Op.between]: [startTime, endTime] } },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: startTime } },
                            { end_time: { [Op.gte]: endTime } },
                        ],
                    },
                ],
            },
        });

        if (overlapping > 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Table is not available for the selected time' },
            });
        }

        // Calculate base cost
        const baseCost = table.tableType.hourly_rate * durationHours;
        let discount = 0;
        let promoId = null;

        // Apply promo code if provided
        if (promo_code) {
            const promo = await Promo.findOne({ where: { code: promo_code.toUpperCase() } });

            if (promo && promo.isValid(durationHours)) {
                if (promo.discount_type === 'percentage') {
                    discount = (baseCost * promo.discount_value) / 100;
                } else {
                    discount = parseFloat(promo.discount_value);
                }

                // Update promo usage
                promo.current_uses += 1;
                await promo.save();
                promoId = promo.id;
            }
        }

        const finalCost = baseCost - discount;

        // Create reservation
        const reservation = await Reservation.create({
            customer_id,
            table_id,
            promo_id: promoId,
            start_time: startTime,
            end_time: endTime,
            duration_hours: durationHours,
            base_cost: baseCost,
            discount,
            final_cost: finalCost,
            status: 'pending',
            notes,
        });

        // Create payment record
        await Payment.create({
            reservation_id: reservation.id,
            amount: finalCost,
            payment_method: 'cash', // Default, can be updated later
            payment_status: 'pending',
        });

        // Log activity
        await ActivityLog.create({
            customer_id,
            action: 'CREATE_RESERVATION',
            description: `Created reservation for table ${table.table_number}`,
            ip_address: req.ip,
        });

        // Fetch complete reservation data
        const completeReservation = await Reservation.findByPk(reservation.id, {
            include: [
                {
                    association: 'table',
                    include: ['tableType'],
                },
                'promo',
                'payment',
            ],
        });

        logger.info(`Reservation created: ${reservation.id} by customer ${customer_id}`);

        res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            data: { reservation: completeReservation },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update reservation
 * PUT /api/reservations/:id
 */
export const updateReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: { message: 'Reservation not found' },
            });
        }

        // Customers can only cancel their own reservations
        if (req.user.type === 'customer') {
            if (reservation.customer_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: { message: 'Access denied' },
                });
            }

            // Customers can only cancel
            if (status && status !== 'cancelled') {
                return res.status(403).json({
                    success: false,
                    error: { message: 'You can only cancel your reservation' },
                });
            }
        }

        // Update reservation
        if (status) reservation.status = status;
        if (notes !== undefined) reservation.notes = notes;

        await reservation.save();

        // Log activity
        if (req.user.type === 'customer') {
            await ActivityLog.create({
                customer_id: req.user.id,
                action: 'UPDATE_RESERVATION',
                description: `Updated reservation ${id}`,
                ip_address: req.ip,
            });
        }

        logger.info(`Reservation ${id} updated by ${req.user.type} ${req.user.email}`);

        res.json({
            success: true,
            message: 'Reservation updated successfully',
            data: { reservation },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel reservation
 * DELETE /api/reservations/:id
 */
export const cancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id, {
            include: ['payment'],
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: { message: 'Reservation not found' },
            });
        }

        // Check ownership for customers
        if (req.user.type === 'customer' && reservation.customer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: { message: 'Access denied' },
            });
        }

        // Can't cancel completed reservations
        if (reservation.status === 'completed') {
            return res.status(400).json({
                success: false,
                error: { message: 'Cannot cancel completed reservation' },
            });
        }

        // Update reservation status
        reservation.status = 'cancelled';
        await reservation.save();

        // Update payment if exists and paid
        if (reservation.payment && reservation.payment.payment_status === 'paid') {
            reservation.payment.payment_status = 'refunded';
            await reservation.payment.save();
        }

        // Log activity
        if (req.user.type === 'customer') {
            await ActivityLog.create({
                customer_id: req.user.id,
                action: 'CANCEL_RESERVATION',
                description: `Cancelled reservation ${id}`,
                ip_address: req.ip,
            });
        }

        logger.info(`Reservation ${id} cancelled by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Reservation cancelled successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Process payment
 * POST /api/reservations/:id/payment
 */
export const processPayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_method } = req.body;

        const reservation = await Reservation.findByPk(id, {
            include: ['payment'],
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: { message: 'Reservation not found' },
            });
        }

        // Check ownership for customers
        if (req.user.type === 'customer' && reservation.customer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: { message: 'Access denied' },
            });
        }

        if (!reservation.payment) {
            return res.status(404).json({
                success: false,
                error: { message: 'Payment record not found' },
            });
        }

        if (reservation.payment.payment_status === 'paid') {
            return res.status(400).json({
                success: false,
                error: { message: 'Payment already processed' },
            });
        }

        // Update payment
        reservation.payment.payment_method = payment_method;
        reservation.payment.payment_status = 'paid';
        reservation.payment.paid_at = new Date();
        await reservation.payment.save();

        // Update reservation status
        reservation.status = 'confirmed';
        await reservation.save();

        logger.info(`Payment processed for reservation ${id}`);

        res.json({
            success: true,
            message: 'Payment processed successfully',
            data: { payment: reservation.payment },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validation rules
 */
export const createReservationValidation = [
    body('table_id').isUUID().withMessage('Valid table ID required'),
    body('start_time').isISO8601().withMessage('Valid start time required'),
    body('end_time').isISO8601().withMessage('Valid end time required'),
    body('promo_code').optional().isString(),
    body('notes').optional().isString(),
];

export const checkAvailabilityValidation = [
    body('table_id').isUUID().withMessage('Valid table ID required'),
    body('start_time').isISO8601().withMessage('Valid start time required'),
    body('end_time').isISO8601().withMessage('Valid end time required'),
];

export const updateReservationValidation = [
    body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
    body('notes').optional().isString(),
];

export const processPaymentValidation = [
    body('payment_method').isIn(['cash', 'card', 'e-wallet']).withMessage('Valid payment method required'),
];

// Helper function
function calculateCost(hourlyRate, hours) {
    return hourlyRate * hours;
}

export default {
    getAllReservations,
    getReservationById,
    checkAvailability,
    createReservation,
    updateReservation,
    cancelReservation,
    processPayment,
    createReservationValidation,
    checkAvailabilityValidation,
    updateReservationValidation,
    processPaymentValidation,
};
