import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/helpers';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    TrendingUp,
    DollarSign,
    Users,
    Table,
    Tag,
    Clock,
    Calendar,
    Download,
    Filter,
    RefreshCw
} from 'lucide-react';
import reportsService from '../../services/reportsService';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('revenue');
    const [dateRange, setDateRange] = useState('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // Fetch data based on active tab
    useEffect(() => {
        const params = {};
        if (startDate && endDate) {
            params.startDate = startDate;
            params.endDate = endDate;
        } else if (dateRange !== 'custom') {
            params.period = dateRange;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                let result;
                switch (activeTab) {
                    case 'revenue':
                        result = await reportsService.getRevenueReports(params);
                        break;
                    case 'tables':
                        result = await reportsService.getTablePerformance(params);
                        break;
                    case 'customers':
                        result = await reportsService.getCustomerAnalytics(params);
                        break;
                    case 'promos':
                        result = await reportsService.getPromoEffectiveness();
                        break;
                    case 'hourly':
                        result = await reportsService.getHourlyAnalytics(params);
                        break;
                    default:
                        result = {};
                }
                setData(result);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, dateRange, startDate, endDate]);

    // Custom colors
    const COLORS = ['#00a859', '#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    const tabs = [
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'tables', label: 'Tables', icon: Table },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'promos', label: 'Promos', icon: Tag },
        { id: 'hourly', label: 'Hourly', icon: Clock }
    ];

    const renderRevenueReport = () => (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold text-white">{formatCurrency(data.summary?.totalRevenue || 0)}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Transactions</h3>
                    <p className="text-2xl font-bold text-white">{data.summary?.transactionCount || 0}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Average Transaction</h3>
                    <p className="text-2xl font-bold text-white">{formatCurrency(data.summary?.averageTransaction || 0)}</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailyRevenue || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                            labelStyle={{ color: '#f3f4f6' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#00a859"
                            strokeWidth={2}
                            dot={{ fill: '#00a859' }}
                            name="Revenue"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderTablePerformance = () => (
        <div className="space-y-6">
            <div className="card">
                <div className="p-6 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary text-sm">
                                <th className="pb-4">Table</th>
                                <th className="pb-4">Type</th>
                                <th className="pb-4">Reservations</th>
                                <th className="pb-4">Total Hours</th>
                                <th className="pb-4">Avg Duration</th>
                                <th className="pb-4">Revenue</th>
                                <th className="pb-4">Utilization</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data || []).map((table) => (
                                <tr key={table.tableId} className="border-t border-text-muted/10">
                                    <td className="py-4 text-white">🎱 {table.tableNumber}</td>
                                    <td className="py-4 text-text-secondary">{table.tableType}</td>
                                    <td className="py-4 text-white">{table.reservations}</td>
                                    <td className="py-4 text-white">{table.totalHours.toFixed(1)}h</td>
                                    <td className="py-4 text-white">{table.averageDuration.toFixed(1)}h</td>
                                    <td className="py-4 text-white">{formatCurrency(table.estimatedRevenue)}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-surface-elevated rounded-full h-2">
                                                <div
                                                    className="bg-admin-primary h-2 rounded-full"
                                                    style={{ width: `${Math.min(table.utilizationRate, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-text-secondary text-sm">{table.utilizationRate.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Tables Chart */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top Performing Tables</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={(data || []).slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="tableNumber" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                            labelStyle={{ color: '#f3f4f6' }}
                        />
                        <Bar dataKey="estimatedRevenue" fill="#00a859" name="Revenue" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderCustomerAnalytics = () => (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Total Customers</h3>
                    <p className="text-2xl font-bold text-white">{data.summary?.totalCustomers || 0}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">New (30 days)</h3>
                    <p className="text-2xl font-bold text-white">{data.summary?.newCustomers30Days || 0}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">New (7 days)</h3>
                    <p className="text-2xl font-bold text-white">{data.summary?.newCustomers7Days || 0}</p>
                </div>
            </div>

            {/* Top Customers */}
            <div className="card">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Top Customers by Spending</h2>
                    <div className="space-y-3">
                        {(data.topCustomers || []).map((customer, index) => (
                            <div key={customer.customerId} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-admin-primary/20 rounded-full flex items-center justify-center text-admin-primary font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{customer.customerName}</p>
                                        <p className="text-text-secondary text-sm">{customer.reservations} reservations</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-semibold">{formatCurrency(customer.totalSpent)}</p>
                                    <p className="text-text-muted text-xs">Avg: {formatCurrency(customer.averageSpent)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPromoEffectiveness = () => (
        <div className="space-y-6">
            <div className="card">
                <div className="p-6 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary text-sm">
                                <th className="pb-4">Promo Code</th>
                                <th className="pb-4">Type</th>
                                <th className="pb-4">Value</th>
                                <th className="pb-4">Usage</th>
                                <th className="pb-4">Usage %</th>
                                <th className="pb-4">Total Discount</th>
                                <th className="pb-4">ROI %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data || []).map((promo) => (
                                <tr key={promo.promoId} className="border-t border-text-muted/10">
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} className="text-admin-accent" />
                                            <span className="text-white font-mono font-bold">{promo.code}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-text-secondary">
                                        {promo.discountType === 'percentage' ? `${promo.discountValue}%` : formatCurrency(promo.discountValue)}
                                    </td>
                                    <td className="py-4 text-white">{promo.description || '-'}</td>
                                    <td className="py-4 text-white">{promo.usageCount}</td>
                                    <td className="py-4">
                                        {promo.usagePercentage ? (
                                            <span className="text-text-primary">{promo.usagePercentage}%</span>
                                        ) : (
                                            <span className="text-text-muted">Unlimited</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-text-primary">{formatCurrency(promo.totalDiscount)}</td>
                                    <td className="py-4">
                                        <span className={`font-semibold ${parseFloat(promo.roi) > 0 ? 'text-status-success' : 'text-status-error'
                                            }`}>
                                            {promo.roi}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderHourlyAnalytics = () => (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Peak Hour</h3>
                    <p className="text-2xl font-bold text-white">{data.peakHour?.hour || 0}:00</p>
                    <p className="text-text-secondary text-sm">{data.peakHour?.count || 0} reservations</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Total Reservations</h3>
                    <p className="text-2xl font-bold text-white">{data.totalReservations || 0}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-text-secondary text-sm mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold text-white">{formatCurrency(data.totalRevenue || 0)}</p>
                </div>
            </div>

            {/* Hourly Distribution Chart */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Hourly Distribution</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.hourlyStats || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                            labelStyle={{ color: '#f3f4f6' }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#00a859" name="Reservations" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const handleRefresh = () => {
        // Force re-fetch by updating state
        const currentTab = activeTab;
        setActiveTab('');
        setTimeout(() => setActiveTab(currentTab), 100);
    };

    const handleExport = () => {
        try {
            let csvContent = '';
            let filename = '';

            switch (activeTab) {
                case 'revenue':
                    filename = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
                    csvContent = 'Date,Revenue,Transactions\n';
                    (data.dailyRevenue || []).forEach(row => {
                        csvContent += `${row.date},${row.revenue},${row.transactions || 0}\n`;
                    });
                    break;

                case 'tables':
                    filename = `table_performance_${new Date().toISOString().split('T')[0]}.csv`;
                    csvContent = 'Table,Type,Reservations,Total Hours,Avg Duration,Revenue,Utilization %\n';
                    (data || []).forEach(table => {
                        csvContent += `${table.tableNumber},${table.tableType},${table.reservations},${table.totalHours.toFixed(1)},${table.averageDuration.toFixed(1)},${table.estimatedRevenue},${table.utilizationRate.toFixed(1)}\n`;
                    });
                    break;

                case 'customers':
                    filename = `customer_analytics_${new Date().toISOString().split('T')[0]}.csv`;
                    csvContent = 'Customer Name,Reservations,Total Spent,Average Spent\n';
                    (data.topCustomers || []).forEach(customer => {
                        csvContent += `${customer.customerName},${customer.reservations},${customer.totalSpent},${customer.averageSpent}\n`;
                    });
                    break;

                case 'promos':
                    filename = `promo_effectiveness_${new Date().toISOString().split('T')[0]}.csv`;
                    csvContent = 'Promo Code,Type,Value,Usage Count,Total Discount,ROI %\n';
                    (data || []).forEach(promo => {
                        const value = promo.discountType === 'percentage' ? `${promo.discountValue}%` : promo.discountValue;
                        csvContent += `${promo.code},${promo.discountType},${value},${promo.usageCount},${promo.totalDiscount},${promo.roi}\n`;
                    });
                    break;

                case 'hourly':
                    filename = `hourly_analytics_${new Date().toISOString().split('T')[0]}.csv`;
                    csvContent = 'Hour,Reservations,Revenue\n';
                    (data.hourlyStats || []).forEach(stat => {
                        csvContent += `${stat.hour}:00,${stat.count},${stat.revenue || 0}\n`;
                    });
                    break;

                default:
                    console.warn('No export available for this tab');
                    return;
            }

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`Exported ${filename} successfully`);
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
                    <p className="text-text-secondary">Business insights and performance metrics</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="btn btn-outline-admin inline-flex items-center gap-2"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        className="btn btn-primary-admin inline-flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-admin-primary text-white'
                                        : 'text-text-secondary hover:bg-surface-elevated'
                                    }`}
                            >
                                <tab.icon size={18} className="inline mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="input"
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        {dateRange === 'custom' && (
                            <>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="input"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="input"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'revenue' && renderRevenueReport()}
                    {activeTab === 'tables' && renderTablePerformance()}
                    {activeTab === 'customers' && renderCustomerAnalytics()}
                    {activeTab === 'promos' && renderPromoEffectiveness()}
                    {activeTab === 'hourly' && renderHourlyAnalytics()}
                </>
            )}
        </div>
    );
};

export default ReportsPage;