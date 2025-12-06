import express from 'express';
import Table from '../models/Table.js';
import TableType from '../models/TableType.js';
import Reservation from '../models/Reservation.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * Get all tables with their types (public endpoint)
 */
router.get('/', async (req, res, next) => {
    try {
        const tables = await Table.findAll({
            include: [{
                model: TableType,
                as: 'tableType',
                attributes: ['id', 'name', 'hourly_rate']
            }],
            attributes: ['id', 'table_number', 'status', 'table_type_id']
        });

        res.json({
            success: true,
            data: tables
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get available tables for specific date/time
 */
router.get('/available', async (req, res, next) => {
    try {
        const { date, time, duration } = req.query;

        if (!date || !time) {
            return res.status(400).json({
                success: false,
                error: { message: 'Date and time are required' }
            });
        }

        // Parse the requested start time
        const startTime = new Date(`${date}T${time}`);
        const endTime = new Date(startTime.getTime() + (parseInt(duration) || 60) * 60000);

        // Find tables that are NOT reserved during this time period
        const reservedTables = await Reservation.findAll({
            where: {
                [Op.or]: [
                    {
                        start_time: {
                            [Op.lt]: endTime
                        },
                        end_time: {
                            [Op.gt]: startTime
                        },
                        status: {
                            [Op.in]: ['pending', 'confirmed']
                        }
                    }
                ]
            },
            attributes: ['table_id']
        });

        const reservedTableIds = reservedTables.map(r => r.table_id);

        const availableTables = await Table.findAll({
            where: {
                id: {
                    [Op.notIn]: reservedTableIds
                },
                status: 'available'
            },
            include: [{
                model: TableType,
                as: 'tableType',
                attributes: ['id', 'name', 'hourly_rate']
            }],
            attributes: ['id', 'table_number', 'status', 'table_type_id']
        });

        res.json({
            success: true,
            data: availableTables
        });
    } catch (error) {
        next(error);
    }
});

export default router;