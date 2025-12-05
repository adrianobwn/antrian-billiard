import { Op } from 'sequelize';
import { body } from 'express-validator';
import { Table, TableType, Promo, Reservation, Payment, Customer } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Get Dashboard Statistics
 * GET /api/admin/dashboard/stats
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Count totals
        const totalTables = await Table.count();
        const totalCustomers = await Customer.count();
        const totalReservations = await Reservation.count();

        // Today's reservations
        const todayReservations = await Reservation.count({
            where: {
                start_time: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow,
                },
            },
        });

        // Active reservations
        const activeReservations = await Reservation.count({
            where: {
                status: ['pending', 'confirmed'],
            },
        });

        // Today's revenue
        const todayRevenue = await Payment.sum('amount', {
            where: {
                payment_status: 'paid',
                paid_at: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow,
                },
            },
        });

        // Total revenue
        const totalRevenue = await Payment.sum('amount', {
            where: {
                payment_status: 'paid',
            },
        });

        // Table status counts
        const availableTables = await Table.count({ where: { status: 'available' } });
        const occupiedTables = await Table.count({ where: { status: 'occupied' } });
        const maintenanceTables = await Table.count({ where: { status: 'maintenance' } });

        res.json({
            success: true,
            data: {
                stats: {
                    totalTables,
                    totalCustomers,
                    totalReservations,
                    todayReservations,
                    activeReservations,
                    todayRevenue: todayRevenue || 0,
                    totalRevenue: totalRevenue || 0,
                },
                tableStats: {
                    available: availableTables,
                    occupied: occupiedTables,
                    maintenance: maintenanceTables,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Real-time Table Status
 * GET /api/admin/dashboard/table-status
 */
export const getTableStatus = async (req, res, next) => {
    try {
        const tables = await Table.findAll({
            include: [
                {
                    association: 'tableType',
                },
                {
                    association: 'reservations',
                    where: {
                        status: ['pending', 'confirmed'],
                        start_time: {
                            [Op.lte]: new Date(),
                        },
                        end_time: {
                            [Op.gte]: new Date(),
                        },
                    },
                    required: false,
                    include: ['customer'],
                },
            ],
            order: [['table_number', 'ASC']],
        });

        res.json({
            success: true,
            data: { tables },
        });
    } catch (error) {
        next(error);
    }
};

// ========== TABLE MANAGEMENT ==========

/**
 * Get all tables
 * GET /api/admin/tables
 */
export const getAllTables = async (req, res, next) => {
    try {
        const tables = await Table.findAll({
            include: ['tableType'],
            order: [['table_number', 'ASC']],
        });

        res.json({
            success: true,
            data: { tables },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get table by ID
 * GET /api/admin/tables/:id
 */
export const getTableById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const table = await Table.findByPk(id, {
            include: ['tableType'],
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table not found' },
            });
        }

        res.json({
            success: true,
            data: { table },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create table
 * POST /api/admin/tables
 */
export const createTable = async (req, res, next) => {
    try {
        const { table_number, table_type_id, status } = req.body;

        // Check if table number already exists
        const existing = await Table.findOne({ where: { table_number } });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: { message: 'Table number already exists' },
            });
        }

        // Verify table type exists
        const tableType = await TableType.findByPk(table_type_id);
        if (!tableType) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table type not found' },
            });
        }

        const table = await Table.create({
            table_number,
            table_type_id,
            status: status || 'available',
        });

        const completeTable = await Table.findByPk(table.id, {
            include: ['tableType'],
        });

        logger.info(`Table created: ${table_number} by admin ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Table created successfully',
            data: { table: completeTable },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update table
 * PUT /api/admin/tables/:id
 */
export const updateTable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { table_number, table_type_id, status } = req.body;

        const table = await Table.findByPk(id);
        if (!table) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table not found' },
            });
        }

        // Check table number uniqueness if changed
        if (table_number && table_number !== table.table_number) {
            const existing = await Table.findOne({ where: { table_number } });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Table number already exists' },
                });
            }
            table.table_number = table_number;
        }

        if (table_type_id) {
            const tableType = await TableType.findByPk(table_type_id);
            if (!tableType) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Table type not found' },
                });
            }
            table.table_type_id = table_type_id;
        }

        if (status) table.status = status;

        await table.save();

        const updatedTable = await Table.findByPk(id, {
            include: ['tableType'],
        });

        logger.info(`Table ${id} updated by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Table updated successfully',
            data: { table: updatedTable },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete table
 * DELETE /api/admin/tables/:id
 */
export const deleteTable = async (req, res, next) => {
    try {
        const { id } = req.params;

        const table = await Table.findByPk(id);
        if (!table) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table not found' },
            });
        }

        // Check for active reservations
        const activeReservations = await Reservation.count({
            where: {
                table_id: id,
                status: ['pending', 'confirmed'],
            },
        });

        if (activeReservations > 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Cannot delete table with active reservations' },
            });
        }

        await table.destroy();

        logger.info(`Table ${id} deleted by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Table deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// ========== TABLE TYPE MANAGEMENT ==========

/**
 * Get all table types
 * GET /api/admin/table-types
 */
export const getAllTableTypes = async (req, res, next) => {
    try {
        const tableTypes = await TableType.findAll({
            order: [['hourly_rate', 'ASC']],
        });

        res.json({
            success: true,
            data: { tableTypes },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create table type
 * POST /api/admin/table-types
 */
export const createTableType = async (req, res, next) => {
    try {
        const { name, hourly_rate, description } = req.body;

        // Check if name already exists
        const existing = await TableType.findOne({ where: { name } });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: { message: 'Table type name already exists' },
            });
        }

        const tableType = await TableType.create({
            name,
            hourly_rate,
            description,
        });

        logger.info(`Table type created: ${name} by admin ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Table type created successfully',
            data: { tableType },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update table type
 * PUT /api/admin/table-types/:id
 */
export const updateTableType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, hourly_rate, description } = req.body;

        const tableType = await TableType.findByPk(id);
        if (!tableType) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table type not found' },
            });
        }

        if (name) tableType.name = name;
        if (hourly_rate) tableType.hourly_rate = hourly_rate;
        if (description !== undefined) tableType.description = description;

        await tableType.save();

        logger.info(`Table type ${id} updated by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Table type updated successfully',
            data: { tableType },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete table type
 * DELETE /api/admin/table-types/:id
 */
export const deleteTableType = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tableType = await TableType.findByPk(id);
        if (!tableType) {
            return res.status(404).json({
                success: false,
                error: { message: 'Table type not found' },
            });
        }

        // Check if any tables use this type
        const tablesUsingType = await Table.count({ where: { table_type_id: id } });
        if (tablesUsingType > 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Cannot delete table type that is in use' },
            });
        }

        await tableType.destroy();

        logger.info(`Table type ${id} deleted by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Table type deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// ========== PROMO MANAGEMENT ==========

/**
 * Get all promos
 * GET /api/admin/promos
 */
export const getAllPromos = async (req, res, next) => {
    try {
        const promos = await Promo.findAll({
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: { promos },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create promo
 * POST /api/admin/promos
 */
export const createPromo = async (req, res, next) => {
    try {
        const {
            code,
            description,
            discount_type,
            discount_value,
            min_hours,
            valid_from,
            valid_until,
            max_uses,
            is_active,
        } = req.body;

        // Check if code already exists
        const existing = await Promo.findOne({ where: { code: code.toUpperCase() } });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: { message: 'Promo code already exists' },
            });
        }

        const promo = await Promo.create({
            code: code.toUpperCase(),
            description,
            discount_type,
            discount_value,
            min_hours: min_hours || 0,
            valid_from,
            valid_until,
            max_uses,
            current_uses: 0,
            is_active: is_active !== undefined ? is_active : true,
        });

        logger.info(`Promo created: ${code} by admin ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Promo created successfully',
            data: { promo },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update promo
 * PUT /api/admin/promos/:id
 */
export const updatePromo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            description,
            discount_type,
            discount_value,
            min_hours,
            valid_from,
            valid_until,
            max_uses,
            is_active,
        } = req.body;

        const promo = await Promo.findByPk(id);
        if (!promo) {
            return res.status(404).json({
                success: false,
                error: { message: 'Promo not found' },
            });
        }

        if (description !== undefined) promo.description = description;
        if (discount_type) promo.discount_type = discount_type;
        if (discount_value) promo.discount_value = discount_value;
        if (min_hours !== undefined) promo.min_hours = min_hours;
        if (valid_from) promo.valid_from = valid_from;
        if (valid_until) promo.valid_until = valid_until;
        if (max_uses !== undefined) promo.max_uses = max_uses;
        if (is_active !== undefined) promo.is_active = is_active;

        await promo.save();

        logger.info(`Promo ${id} updated by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Promo updated successfully',
            data: { promo },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete promo
 * DELETE /api/admin/promos/:id
 */
export const deletePromo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const promo = await Promo.findByPk(id);
        if (!promo) {
            return res.status(404).json({
                success: false,
                error: { message: 'Promo not found' },
            });
        }

        await promo.destroy();

        logger.info(`Promo ${id} deleted by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Promo deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validate promo code
 * POST /api/admin/promos/validate
 */
export const validatePromo = async (req, res, next) => {
    try {
        const { code, hours } = req.body;

        const promo = await Promo.findOne({ where: { code: code.toUpperCase() } });

        if (!promo) {
            return res.json({
                success: true,
                data: {
                    valid: false,
                    reason: 'Promo code not found',
                },
            });
        }

        const isValid = promo.isValid(hours || 0);

        res.json({
            success: true,
            data: {
                valid: isValid,
                promo: isValid ? promo : null,
                ...(!isValid && {
                    reason: !promo.is_active
                        ? 'Promo is not active'
                        : promo.max_uses && promo.current_uses >= promo.max_uses
                            ? 'Promo usage limit reached'
                            : hours < promo.min_hours
                                ? `Minimum ${promo.min_hours} hours required`
                                : 'Promo not valid',
                }),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validation rules
 */
export const tableValidation = [
    body('table_number').trim().notEmpty().withMessage('Table number is required'),
    body('table_type_id').isUUID().withMessage('Valid table type ID required'),
    body('status').optional().isIn(['available', 'occupied', 'maintenance']),
];

export const tableTypeValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('hourly_rate').isFloat({ min: 0 }).withMessage('Valid hourly rate required'),
    body('description').optional().isString(),
];

export const promoValidation = [
    body('code').trim().notEmpty().withMessage('Promo code is required'),
    body('discount_type').isIn(['percentage', 'fixed']).withMessage('Valid discount type required'),
    body('discount_value').isFloat({ min: 0 }).withMessage('Valid discount value required'),
    body('min_hours').optional().isInt({ min: 0 }),
    body('valid_from').isDate().withMessage('Valid start date required'),
    body('valid_until').isDate().withMessage('Valid end date required'),
    body('max_uses').optional().isInt({ min: 1 }),
    body('is_active').optional().isBoolean(),
];

export default {
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
    tableValidation,
    tableTypeValidation,
    promoValidation,
};
