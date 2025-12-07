import { Table, Reservation, Payment, Customer, TableType } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Get table statistics
        const tableStats = await Table.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        const tableStatsMap = tableStats.reduce((acc, stat) => {
            acc[stat.status] = parseInt(stat.count);
            return acc;
        }, {});

        // Get today's reservations
        const todayReservations = await Reservation.findAll({
            where: {
                created_at: {
                    [Op.between]: [today, endOfDay]
                }
            },
            raw: true
        });

        // Get today's revenue (completed payments)
        const todayRevenue = await Payment.sum('amount', {
            where: {
                payment_status: 'paid',
                paid_at: {
                    [Op.between]: [today, endOfDay]
                }
            }
        }) || 0;

        // Get total customers
        const totalCustomers = await Customer.count();

        // Get monthly revenue
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyRevenue = await Payment.sum('amount', {
            where: {
                payment_status: 'paid',
                paid_at: {
                    [Op.gte]: startOfMonth
                }
            }
        }) || 0;

        // Get active reservations (currently ongoing)
        const activeReservations = await Reservation.count({
            where: {
                status: 'active',
                start_time: {
                    [Op.lte]: new Date()
                },
                end_time: {
                    [Op.gte]: new Date()
                }
            }
        });

        // Get total tables count
        const totalTables = await Table.count();

        const stats = {
            revenue: todayRevenue,
            activeTables: activeReservations,
            todayReservations: todayReservations.length,
            totalCustomers: totalCustomers,
            monthlyRevenue: monthlyRevenue,
            occupiedTables: tableStatsMap.occupied || 0,
            availableTables: tableStatsMap.available || 0,
            maintenanceTables: tableStatsMap.maintenance || 0,
            totalTables: totalTables,
            // Additional stats for charts
            reservationsByStatus: await getReservationsByStatus(),
            revenueByMonth: await getRevenueByMonth(),
            tableTypeUsage: await getTableTypeUsage(),
            recentReservations: await getRecentReservations()
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch dashboard statistics'
            }
        });
    }
};

// Get real-time table status
export const getTableStatus = async (req, res) => {
    try {
        const tables = await Table.findAll({
            include: [{
                model: TableType,
                as: 'tableType',
                attributes: ['id', 'name', 'color']
            }],
            order: [['table_number', 'ASC']]
        });

        // Get current active reservations for occupied tables
        const activeReservations = await Reservation.findAll({
            where: {
                status: 'active',
                start_time: {
                    [Op.lte]: new Date()
                },
                end_time: {
                    [Op.gte]: new Date()
                }
            },
            include: [{
                model: Customer,
                as: 'customer',
                attributes: ['id', 'name']
            }],
            attributes: ['id', 'table_id', 'end_time']
        });

        // Create map of table_id to reservation
        const reservationMap = activeReservations.reduce((acc, reservation) => {
            acc[reservation.table_id] = {
                customerName: reservation.customer?.name || 'Unknown',
                endTime: reservation.end_time
            };
            return acc;
        }, {});

        // Add reservation info to tables
        const tablesWithStatus = tables.map(table => ({
            id: table.id,
            table_number: table.table_number,
            status: table.status,
            tableType: table.tableType,
            currentReservation: reservationMap[table.id] || null
        }));

        res.json({
            success: true,
            data: tablesWithStatus
        });
    } catch (error) {
        console.error('Error fetching table status:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch table status'
            }
        });
    }
};

// Helper function to get reservations by status
async function getReservationsByStatus() {
    const reservations = await Reservation.findAll({
        attributes: [
            'status',
            [fn('COUNT', col('id')), 'count']
        ],
        group: ['status'],
        raw: true
    });

    return reservations.map(r => ({
        status: r.status,
        count: parseInt(r.count)
    }));
}

// Helper function to get revenue by month
async function getRevenueByMonth() {
    const currentYear = new Date().getFullYear();
    const revenue = await Payment.findAll({
        attributes: [
            [literal('MONTH(paid_at)'), 'month'],
            [fn('SUM', col('amount')), 'revenue']
        ],
        where: {
            payment_status: 'paid',
            paid_at: {
                [Op.gte]: new Date(currentYear, 0, 1),
                [Op.lte]: new Date(currentYear, 11, 31)
            }
        },
        group: [literal('MONTH(paid_at)')],
        raw: true
    });

    // Initialize all months with 0
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        monthName: new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        revenue: 0
    }));

    // Fill with actual data
    revenue.forEach(r => {
        const monthIndex = parseInt(r.month) - 1;
        if (monthlyData[monthIndex]) {
            monthlyData[monthIndex].revenue = parseFloat(r.revenue);
        }
    });

    return monthlyData;
}

// Helper function to get table type usage
async function getTableTypeUsage() {
    const usage = await Reservation.findAll({
        attributes: [
            [fn('COUNT', col('Reservation.id')), 'count']
        ],
        include: [{
            model: Table,
            as: 'table',
            attributes: [],
            include: [{
                model: TableType,
                as: 'tableType',
                attributes: ['name']
            }]
        }],
        group: ['table.tableType.id', 'table.tableType.name'],
        raw: true
    });

    return usage.map(u => ({
        tableType: u['table.tableType.name'],
        count: parseInt(u.count)
    }));
}

// Helper function to get recent reservations
async function getRecentReservations() {
    const reservations = await Reservation.findAll({
        limit: 30,
        order: [['created_at', 'DESC']],
        include: [{
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name']
        }, {
            model: Table,
            as: 'table',
            attributes: ['table_number']
        }],
        attributes: ['id', 'status', 'created_at', 'start_time', 'final_cost']
    });

    return reservations.map(r => ({
        id: r.id,
        customerName: r.customer?.name || 'Unknown',
        tableNumber: r.table?.table_number || 'N/A',
        status: r.status,
        createdAt: r.created_at,
        startTime: r.start_time,
        cost: r.final_cost
    }));
}

export default {
    getDashboardStats,
    getTableStatus
};