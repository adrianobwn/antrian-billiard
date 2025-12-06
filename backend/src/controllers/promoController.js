import { Promo } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Get all promos
export const getAllPromos = async (req, res) => {
    try {
        const { includeInactive = false } = req.query;

        const whereClause = includeInactive === 'true' ? {} : { is_active: true };

        const promos = await Promo.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: promos
        });
    } catch (error) {
        console.error('Error fetching promos:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch promos'
            }
        });
    }
};

// Get promo by ID
export const getPromoById = async (req, res) => {
    try {
        const { id } = req.params;
        const promo = await Promo.findByPk(id);

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Promo not found'
                }
            });
        }

        res.json({
            success: true,
            data: promo
        });
    } catch (error) {
        console.error('Error fetching promo:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch promo'
            }
        });
    }
};

// Create new promo
export const createPromo = async (req, res) => {
    try {
        const {
            code,
            description,
            discount_type,
            discount_value,
            min_hours = 0,
            valid_from,
            valid_until,
            max_uses,
            is_active = true
        } = req.body;

        // Check if promo code already exists
        const existingPromo = await Promo.findOne({
            where: {
                code: code.toUpperCase()
            }
        });

        if (existingPromo) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Promo code already exists'
                }
            });
        }

        // Validate dates
        const fromDate = new Date(valid_from);
        const untilDate = new Date(valid_until);

        if (fromDate >= untilDate) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Valid from date must be before valid until date'
                }
            });
        }

        // Validate discount value
        if (discount_type === 'percentage' && (discount_value < 0 || discount_value > 100)) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Percentage discount must be between 0 and 100'
                }
            });
        }

        if (discount_type === 'fixed' && discount_value < 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Fixed discount must be greater than 0'
                }
            });
        }

        const promo = await Promo.create({
            code: code.toUpperCase(),
            description: description?.trim() || null,
            discount_type,
            discount_value: parseFloat(discount_value),
            min_hours: parseInt(min_hours) || 0,
            valid_from: fromDate,
            valid_until: untilDate,
            max_uses: max_uses ? parseInt(max_uses) : null,
            is_active
        });

        res.status(201).json({
            success: true,
            data: promo,
            message: 'Promo created successfully'
        });
    } catch (error) {
        console.error('Error creating promo:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create promo',
                details: error.errors?.map(e => e.message)
            }
        });
    }
};

// Update promo
export const updatePromo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const promo = await Promo.findByPk(id);
        if (!promo) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Promo not found'
                }
            });
        }

        // Check if code is being changed and if new code already exists
        if (updateData.code && updateData.code.toUpperCase() !== promo.code) {
            const existingPromo = await Promo.findOne({
                where: {
                    code: updateData.code.toUpperCase(),
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existingPromo) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Promo code already exists'
                    }
                });
            }
        }

        // Validate dates if both provided
        if (updateData.valid_from && updateData.valid_until) {
            const fromDate = new Date(updateData.valid_from);
            const untilDate = new Date(updateData.valid_until);

            if (fromDate >= untilDate) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Valid from date must be before valid until date'
                    }
                });
            }
        }

        // Validate discount value if provided
        if (updateData.discount_type && updateData.discount_value !== undefined) {
            if (updateData.discount_type === 'percentage' &&
                (updateData.discount_value < 0 || updateData.discount_value > 100)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Percentage discount must be between 0 and 100'
                    }
                });
            }

            if (updateData.discount_type === 'fixed' && updateData.discount_value < 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Fixed discount must be greater than 0'
                    }
                });
            }
        }

        // Update the promo
        const updatedPromo = await promo.update({
            code: updateData.code ? updateData.code.toUpperCase() : promo.code,
            description: updateData.description !== undefined ? (updateData.description?.trim() || null) : promo.description,
            discount_type: updateData.discount_type || promo.discount_type,
            discount_value: updateData.discount_value !== undefined ? parseFloat(updateData.discount_value) : promo.discount_value,
            min_hours: updateData.min_hours !== undefined ? parseInt(updateData.min_hours) : promo.min_hours,
            valid_from: updateData.valid_from ? new Date(updateData.valid_from) : promo.valid_from,
            valid_until: updateData.valid_until ? new Date(updateData.valid_until) : promo.valid_until,
            max_uses: updateData.max_uses !== undefined ? (updateData.max_uses ? parseInt(updateData.max_uses) : null) : promo.max_uses,
            is_active: updateData.is_active !== undefined ? updateData.is_active : promo.is_active,
            current_uses: updateData.current_uses !== undefined ? parseInt(updateData.current_uses) : promo.current_uses
        });

        res.json({
            success: true,
            data: updatedPromo,
            message: 'Promo updated successfully'
        });
    } catch (error) {
        console.error('Error updating promo:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to update promo',
                details: error.errors?.map(e => e.message)
            }
        });
    }
};

// Delete promo
export const deletePromo = async (req, res) => {
    try {
        const { id } = req.params;

        const promo = await Promo.findByPk(id);
        if (!promo) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Promo not found'
                }
            });
        }

        // Check if promo has been used
        if (promo.current_uses > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Cannot delete promo that has been used. Consider deactivating it instead.'
                }
            });
        }

        await promo.destroy();

        res.json({
            success: true,
            message: 'Promo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting promo:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to delete promo'
            }
        });
    }
};

// Validate promo code
export const validatePromo = async (req, res) => {
    try {
        const { code, hours = 0 } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Promo code is required'
                }
            });
        }

        const promo = await Promo.findOne({
            where: {
                code: code.toUpperCase()
            }
        });

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Invalid promo code'
                }
            });
        }

        const isValid = promo.isValid(parseInt(hours));

        res.json({
            success: true,
            data: {
                promo: {
                    id: promo.id,
                    code: promo.code,
                    description: promo.description,
                    discount_type: promo.discount_type,
                    discount_value: promo.discount_value,
                    min_hours: promo.min_hours,
                    valid_from: promo.valid_from,
                    valid_until: promo.valid_until,
                    max_uses: promo.max_uses,
                    current_uses: promo.current_uses
                },
                isValid,
                message: isValid ? 'Promo code is valid' : 'Promo code is not valid'
            }
        });
    } catch (error) {
        console.error('Error validating promo:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to validate promo code'
            }
        });
    }
};

// Get promo statistics
export const getPromoStats = async (req, res) => {
    try {
        const stats = await Promo.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalPromos'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN is_active = true THEN 1 END')), 'activePromos'],
                [sequelize.fn('SUM', sequelize.col('current_uses')), 'totalUses']
            ],
            raw: true
        });

        const topPromos = await Promo.findAll({
            limit: 5,
            order: [['current_uses', 'DESC']],
            attributes: ['id', 'code', 'description', 'current_uses', 'max_uses']
        });

        const data = {
            totalPromos: parseInt(stats[0]?.totalPromos) || 0,
            activePromos: parseInt(stats[0]?.activePromos) || 0,
            totalUses: parseInt(stats[0]?.totalUses) || 0,
            topPromos
        };

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching promo stats:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch promo statistics'
            }
        });
    }
};

export default {
    getAllPromos,
    getPromoById,
    createPromo,
    updatePromo,
    deletePromo,
    validatePromo,
    getPromoStats
};