import { Reservation, Payment, Table, TableType, Customer, Promo } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';

// Get revenue reports
export const getRevenueReports = async (req, res) => {
    try {
        const { period = 'month', startDate, endDate } = req.query;
        let dateFilter = {};

        // Set date range based on period
        const now = new Date();
        if (startDate && endDate) {
            dateFilter = {
                [Op.gte]: new Date(startDate),
                [Op.lte]: new Date(endDate)
            };
        } else {
            switch (period) {
                case 'week':
                    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    dateFilter = {
                        [Op.gte]: weekStart,
                        [Op.lte]: weekEnd
                    };
                    break;
                case 'month':
                    dateFilter = {
                        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
                        [Op.lte]: new Date(now.getFullYear(), now.getMonth() + 1, 0)
                    };
                    break;
                case 'year':
                    dateFilter = {
                        [Op.gte]: new Date(now.getFullYear(), 0, 1),
                        [Op.lte]: new Date(now.getFullYear(), 11, 31)
                    };
                    break;
            }
        }

        const revenue = await Payment.findAll({
            where: {
                payment_status: 'paid',
                paid_at: dateFilter
            },
            attributes: [
                [fn('SUM', col('amount')), 'total'],
                [fn('COUNT', col('id')), 'transaction_count'],
                [fn('AVG', col('amount')), 'average']
            ],
            raw: true
        });

        const revenueByDay = await Payment.findAll({
            where: {
                payment_status: 'paid',
                paid_at: dateFilter
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('paid_at')), 'date'],
                [fn('SUM', col('amount')), 'revenue'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('paid_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('paid_at')), 'ASC']],
            raw: true
        });

        const revenueByMonth = await Payment.findAll({
            where: {
                payment_status: 'paid',
                paid_at: dateFilter
            },
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('paid_at')), 'month'],
                [sequelize.fn('YEAR', sequelize.col('paid_at')), 'year'],
                [fn('SUM', col('amount')), 'revenue'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: [sequelize.fn('MONTH', sequelize.col('paid_at')), sequelize.fn('YEAR', sequelize.col('paid_at'))],
            order: [[sequelize.fn('YEAR', sequelize.col('paid_at')), 'ASC'], [sequelize.fn('MONTH', sequelize.col('paid_at')), 'ASC']],
            raw: true
        });

        const data = {
            summary: {
                totalRevenue: parseFloat(revenue[0]?.total) || 0,
                transactionCount: parseInt(revenue[0]?.transaction_count) || 0,
                averageTransaction: parseFloat(revenue[0]?.average) || 0
            },
            dailyRevenue: revenueByDay.map(r => ({
                date: r.date,
                revenue: parseFloat(r.revenue),
                count: parseInt(r.count)
            })),
            monthlyRevenue: revenueByMonth.map(r => ({
                month: r.month,
                year: r.year,
                revenue: parseFloat(r.revenue),
                count: parseInt(r.count)
            }))
        };

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching revenue reports:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch revenue reports'
            }
        });
    }
};

// Get table performance reports
export const getTablePerformanceReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};

        if (startDate && endDate) {
            dateFilter = {
                start_time: {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: new Date(endDate)
                }
            };
        } else {
            // Default to last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = {
                start_time: {
                    [Op.gte]: thirtyDaysAgo
                }
            };
        }

        const tablePerformance = await Reservation.findAll({
            where: dateFilter,
            include: [{
                model: Table,
                as: 'table',
                attributes: ['table_number'],
                include: [{
                    model: TableType,
                    as: 'tableType',
                    attributes: ['name']
                }]
            }],
            attributes: [
                'table_id',
                [fn('COUNT', col('Reservation.id')), 'reservations'],
                [fn('SUM', col('duration_hours')), 'total_hours'],
                [fn('AVG', col('duration_hours')), 'avg_duration']
            ],
            group: ['table_id', 'table.id', 'table.table_number', 'table.tableType.id', 'table.tableType.name'],
            raw: true
        });

        const tableStats = await Table.findAll({
            include: [{
                model: TableType,
                as: 'tableType',
                attributes: ['name', 'hourly_rate']
            }],
            attributes: ['id', 'table_number', 'status']
        });

        const performanceWithDetails = tablePerformance.map(perf => {
            const table = tableStats.find(t => t.id === perf.table_id);
            const totalRevenue = (perf.total_hours || 0) * (table?.tableType?.hourly_rate || 0);

            return {
                tableId: perf.table_id,
                tableNumber: perf.table_number,
                tableType: perf['table.tableType.name'],
                hourlyRate: table?.tableType?.hourly_rate || 0,
                reservations: parseInt(perf.reservations) || 0,
                totalHours: parseFloat(perf.total_hours) || 0,
                averageDuration: parseFloat(perf.avg_duration) || 0,
                estimatedRevenue: totalRevenue,
                utilizationRate: table ? ((perf.total_hours || 0) / (30 * 12)) * 100 : 0 // Assuming 12 hours/day for 30 days
            };
        });

        // Sort by revenue
        performanceWithDetails.sort((a, b) => b.estimatedRevenue - a.estimatedRevenue);

        res.json({
            success: true,
            data: performanceWithDetails
        });
    } catch (error) {
        console.error('Error fetching table performance reports:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch table performance reports'
            }
        });
    }
};

// Get customer analytics
export const getCustomerAnalytics = async (req, res) => {
    try {
        const customerStats = await Customer.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'total_customers'],
                [fn('COUNT', sequelize.literal('CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END')), 'new_customers_30d'],
                [fn('COUNT', sequelize.literal('CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END')), 'new_customers_7d']
            ],
            raw: true
        });

        const customerReservations = await Reservation.findAll({
            include: [{
                model: Customer,
                as: 'customer',
                attributes: ['id', 'name', 'created_at']
            }],
            attributes: [
                'customer_id',
                [fn('COUNT', col('Reservation.id')), 'reservation_count'],
                [fn('SUM', col('final_cost')), 'total_spent'],
                [fn('AVG', col('final_cost')), 'avg_spent']
            ],
            group: ['customer_id', 'customer.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('Reservation.id')), 'DESC']],
            limit: 10,
            raw: true
        });

        const customersByMonth = await Customer.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('created_at')), 'month'],
                [sequelize.fn('YEAR', sequelize.col('created_at')), 'year'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: [sequelize.fn('MONTH', sequelize.col('created_at')), sequelize.fn('YEAR', sequelize.col('created_at'))],
            order: [[sequelize.fn('YEAR', sequelize.col('created_at')), 'ASC'], [sequelize.fn('MONTH', sequelize.col('created_at')), 'ASC']],
            raw: true
        });

        const topCustomers = customerReservations.map(cust => ({
            customerId: cust.customer_id,
            customerName: cust['customer.name'],
            reservations: parseInt(cust.reservation_count) || 0,
            totalSpent: parseFloat(cust.total_spent) || 0,
            averageSpent: parseFloat(cust.avg_spent) || 0
        }));

        const data = {
            summary: {
                totalCustomers: parseInt(customerStats[0]?.total_customers) || 0,
                newCustomers30Days: parseInt(customerStats[0]?.new_customers_30d) || 0,
                newCustomers7Days: parseInt(customerStats[0]?.new_customers_7d) || 0
            },
            topCustomers,
            customersByMonth: customersByMonth.map(c => ({
                month: c.month,
                year: c.year,
                count: parseInt(c.count)
            }))
        };

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching customer analytics:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch customer analytics'
            }
        });
    }
};

// Get promo effectiveness reports
export const getPromoEffectivenessReports = async (req, res) => {
    try {
        const promoStats = await Promo.findAll({
            where: {
                is_active: true
            },
            attributes: [
                'id',
                'code',
                'description',
                'discount_type',
                'discount_value',
                'current_uses',
                'max_uses'
            ],
            order: [['current_uses', 'DESC']],
            limit: 20
        });

        const promoUsage = await Reservation.findAll({
            where: {
                promo_id: {
                    [Op.not]: null
                }
            },
            include: [{
                model: Promo,
                as: 'promo',
                attributes: ['id', 'code', 'discount_type', 'discount_value']
            }],
            attributes: [
                'promo_id',
                [fn('COUNT', col('Reservation.id')), 'usage_count'],
                [fn('SUM', col('final_cost')), 'total_revenue']
            ],
            group: ['promo_id', 'promo.id', 'promo.code'],
            raw: true
        });

        const promoEffectiveness = promoStats.map(promo => {
            const usage = promoUsage.find(u => u.promo_id === promo.id);
            const discountTotal = usage ?
                (promo.discount_type === 'percentage' ?
                    usage.total_revenue * (promo.discount_value / 100) :
                    promo.discount_value * usage.usage_count) : 0;

            return {
                promoId: promo.id,
                code: promo.code,
                description: promo.description,
                discountType: promo.discount_type,
                discountValue: promo.discount_value,
                usageCount: promo.current_uses,
                maxUses: promo.max_uses,
                usagePercentage: promo.max_uses ? (promo.current_uses / promo.max_uses * 100).toFixed(1) : null,
                totalDiscount: discountTotal,
                roi: discountTotal > 0 ? ((usage.total_revenue - discountTotal) / discountTotal * 100).toFixed(2) : 0
            };
        });

        // Sort by usage count
        promoEffectiveness.sort((a, b) => b.usageCount - a.usageCount);

        res.json({
            success: true,
            data: promoEffectiveness
        });
    } catch (error) {
        console.error('Error fetching promo effectiveness reports:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch promo effectiveness reports'
            }
        });
    }
};

// Get hourly analytics
export const getHourlyAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};

        if (startDate && endDate) {
            dateFilter = {
                start_time: {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: new Date(endDate)
                }
            };
        } else {
            // Default to last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            dateFilter = {
                start_time: {
                    [Op.gte]: sevenDaysAgo
                }
            };
        }

        const hourlyStats = await Reservation.findAll({
            where: dateFilter,
            attributes: [
                [sequelize.fn('HOUR', sequelize.col('start_time')), 'hour'],
                [fn('COUNT', col('id')), 'count'],
                [fn('SUM', col('final_cost')), 'revenue']
            ],
            group: [sequelize.fn('HOUR', sequelize.col('start_time'))],
            order: [[sequelize.fn('HOUR', sequelize.col('start_time')), 'ASC']],
            raw: true
        });

        // Create 24-hour array
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: 0,
            revenue: 0
        }));

        // Fill with actual data
        hourlyStats.forEach(stat => {
            const hourIndex = parseInt(stat.hour);
            if (hourIndex >= 0 && hourIndex < 24) {
                hourlyData[hourIndex] = {
                    hour: hourIndex,
                    count: parseInt(stat.count),
                    revenue: parseFloat(stat.revenue)
                };
            }
        });

        const peakHour = hourlyData.reduce((max, curr) =>
            curr.count > max.count ? curr : max, hourlyData[0]
        );

        res.json({
            success: true,
            data: {
                hourlyStats: hourlyData,
                peakHour,
                totalReservations: hourlyData.reduce((sum, h) => sum + h.count, 0),
                totalRevenue: hourlyData.reduce((sum, h) => sum + h.revenue, 0)
            }
        });
    } catch (error) {
        console.error('Error fetching hourly analytics:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch hourly analytics'
            }
        });
    }
};

export default {
    getRevenueReports,
    getTablePerformanceReports,
    getCustomerAnalytics,
    getPromoEffectivenessReports,
    getHourlyAnalytics
};