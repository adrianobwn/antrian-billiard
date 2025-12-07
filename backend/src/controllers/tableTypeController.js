import { TableType } from '../models/index.js';
import { Op } from 'sequelize';

// Get all table types
export const getAllTableTypes = async (req, res) => {
    try {
        const tableTypes = await TableType.findAll({
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: tableTypes
        });
    } catch (error) {
        console.error('Error fetching table types:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch table types'
            }
        });
    }
};

// Get table type by ID
export const getTableTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const tableType = await TableType.findByPk(id, {
            include: [{
                association: 'tables',
                attributes: ['id', 'table_number', 'status']
            }]
        });

        if (!tableType) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Table type not found'
                }
            });
        }

        res.json({
            success: true,
            data: tableType
        });
    } catch (error) {
        console.error('Error fetching table type:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch table type'
            }
        });
    }
};

// Create new table type
export const createTableType = async (req, res) => {
    try {
        const { name, hourly_rate, description, color, icon } = req.body;

        // Check if table type name already exists (case-insensitive)
        const existingType = await TableType.findOne({
            where: {
                name: {
                    [Op.like]: name
                }
            }
        });

        if (existingType) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Table type with this name already exists'
                }
            });
        }

        const tableType = await TableType.create({
            name: name.trim(),
            hourly_rate: parseFloat(hourly_rate),
            description: description?.trim() || null,
            color: color || '#00a859',
            icon: icon || 'table'
        });

        res.status(201).json({
            success: true,
            data: tableType,
            message: 'Table type created successfully'
        });
    } catch (error) {
        console.error('Error creating table type:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create table type',
                details: error.errors?.map(e => e.message)
            }
        });
    }
};

// Update table type
export const updateTableType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, hourly_rate, description, color, icon, is_active } = req.body;

        const tableType = await TableType.findByPk(id);
        if (!tableType) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Table type not found'
                }
            });
        }

        // Check if name is being changed and if new name already exists
        if (name && name.toLowerCase() !== tableType.name.toLowerCase()) {
            const existingType = await TableType.findOne({
                where: {
                    name: {
                        [Op.like]: name
                    },
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existingType) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Table type with this name already exists'
                    }
                });
            }
        }

        // Check if table type has tables before deactivating
        if (is_active === false && tableType.is_active === true) {
            const activeTablesCount = await countTables(id);
            if (activeTablesCount > 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Cannot deactivate table type. It has associated tables. Please reassign or delete the tables first.'
                    }
                });
            }
        }

        await tableType.update({
            name: name?.trim() || tableType.name,
            hourly_rate: hourly_rate !== undefined ? parseFloat(hourly_rate) : tableType.hourly_rate,
            description: description !== undefined ? (description?.trim() || null) : tableType.description,
            color: color || tableType.color,
            icon: icon || tableType.icon,
            is_active: is_active !== undefined ? is_active : tableType.is_active
        });

        res.json({
            success: true,
            data: tableType,
            message: 'Table type updated successfully'
        });
    } catch (error) {
        console.error('Error updating table type:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to update table type',
                details: error.errors?.map(e => e.message)
            }
        });
    }
};

// Delete table type
export const deleteTableType = async (req, res) => {
    try {
        const { id } = req.params;

        const tableType = await TableType.findByPk(id);
        if (!tableType) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Table type not found'
                }
            });
        }

        // Check if table type has associated tables
        const tablesCount = await countTables(id);
        if (tablesCount > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Cannot delete table type. It has associated tables. Please reassign or delete the tables first.'
                }
            });
        }

        await tableType.destroy();

        res.json({
            success: true,
            message: 'Table type deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting table type:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to delete table type'
            }
        });
    }
};

// Helper method to count tables for a table type
const countTables = async (tableTypeId) => {
    const { Table } = await import('../models/index.js');
    return await Table.count({
        where: {
            table_type_id: tableTypeId
        }
    });
};

export default {
    getAllTableTypes,
    getTableTypeById,
    createTableType,
    updateTableType,
    deleteTableType
};