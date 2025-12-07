import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import {
    Banknote,
    Hash,
    CalendarCheck,
    Users,
    TrendingUp,
    Table,
    Clock,
    Circle,
    AlertCircle,
    Activity,
    Filter,
    RefreshCw,
    Tag
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import tableService from '../../services/tableService';

const StatCard = ({ title, value, icon: Icon, colorClass, change }) => (
    <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            {change && (
                <div className={`flex items-center text-sm ${change > 0 ? 'text-status-success' : 'text-status-error'}`}>
                    <TrendingUp size={16} className="mr-1" />
                    {Math.abs(change)}%
                </div>
            )}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-text-secondary text-sm">{title}</p>
    </div>
);

const TableGrid = ({ tables, onRefresh }) => {
    const [filter, setFilter] = useState('all');

    const filteredTables = tables.filter(table => {
        if (filter === 'all') return true;
        return table.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'text-status-success bg-status-success/10';
            case 'occupied':
                return 'text-status-error bg-status-error/10';
            case 'maintenance':
                return 'text-status-warning bg-status-warning/10';
            default:
                return 'text-text-muted bg-surface-elevated';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'available':
                return <Circle size={16} className="fill-current" />;
            case 'occupied':
                return <Clock size={16} />;
            case 'maintenance':
                return <AlertCircle size={16} />;
            default:
                return <Circle size={16} />;
        }
    };

    return (
        <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Table size={24} className="text-admin-primary" />
                    Table Status Overview
                </h2>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input text-sm py-2"
                    >
                        <option value="all">All Tables</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                    <button
                        onClick={onRefresh}
                        className="btn btn-outline p-2"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredTables.map((table) => (
                    <Link
                        key={table.id}
                        to={`/admin/tables`}
                        className="group relative"
                    >
                        <div className="card p-4 hover:border-admin-primary/50 transition-all cursor-pointer h-full">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">
                                    🎱 {table.table_number}
                                </div>
                                <div className="text-xs text-text-secondary mb-2">
                                    {table.tableType?.name || 'Standard'}
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                                    {getStatusIcon(table.status)}
                                    {table.status}
                                </div>
                            </div>
                            {table.status === 'occupied' && table.currentReservation && (
                                <div className="absolute -top-2 -right-2 bg-status-error text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                    !
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {filteredTables.length === 0 && (
                <div className="text-center py-12">
                    <Table size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                    <p className="text-text-secondary">No tables found</p>
                </div>
            )}
        </div>
    );
};

const RecentActivity = ({ activities }) => {
    return (
        <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={24} className="text-admin-primary" />
                Recent Activity
            </h2>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-text-muted/10 last:border-0">
                        <div className="p-2 bg-surface-elevated rounded-lg">
                            <activity.icon size={16} className="text-admin-accent" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white text-sm">{activity.description}</p>
                            <p className="text-text-muted text-xs mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        activeTables: 0,
        todayReservations: 0,
        totalCustomers: 0,
        monthlyRevenue: 0,
        occupiedTables: 0,
        availableTables: 0,
        maintenanceTables: 0
    });
    const [tables, setTables] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, tableStatusResponse] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getTableStatus()
            ]);

            if (statsResponse.success) {
                setStats(statsResponse.data);
            }

            if (tableStatusResponse) {
                setTables(tableStatusResponse);
            }

            // Transform recent reservations into activities
            if (statsResponse.success && statsResponse.data.recentReservations) {
                const activities = statsResponse.data.recentReservations.map(reservation => ({
                    icon: reservation.status === 'completed' ? Banknote :
                        reservation.status === 'active' ? Clock : CalendarCheck,
                    description: `${reservation.status === 'completed' ? 'Payment received' :
                        reservation.status === 'active' ? 'Active reservation' :
                            'New reservation'} for Table ${reservation.tableNumber}`,
                    time: formatRelativeTime(reservation.createdAt)
                }));
                setRecentActivities(activities);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        }

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-text-secondary">Overview of your billiard hall operations</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="btn btn-outline-admin inline-flex items-center gap-2"
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Revenue"
                    value={formatCurrency(stats.revenue)}
                    icon={Banknote}
                    colorClass="bg-status-success"
                    change={12}
                />
                <StatCard
                    title="Active Tables"
                    value={`${stats.occupiedTables}/${stats.totalTables || 12}`}
                    icon={Table}
                    colorClass="bg-admin-primary"
                />
                <StatCard
                    title="Today's Reservations"
                    value={stats.todayReservations}
                    icon={CalendarCheck}
                    colorClass="bg-admin-accent"
                    change={8}
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    colorClass="bg-status-info"
                />
            </div>

            {/* Table Overview & Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <TableGrid tables={tables} onRefresh={handleRefresh} />
                </div>
                <div className="xl:col-span-1">
                    <RecentActivity activities={recentActivities} />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/reservations"
                        className="btn btn-outline-admin flex items-center justify-center gap-2"
                    >
                        <CalendarCheck size={20} />
                        View All Reservations
                    </Link>
                    <Link
                        to="/admin/tables"
                        className="btn btn-outline-admin flex items-center justify-center gap-2"
                    >
                        <Table size={20} />
                        Manage Tables
                    </Link>
                    <Link
                        to="/admin/promos"
                        className="btn btn-outline-admin flex items-center justify-center gap-2"
                    >
                        <Tag size={20} />
                        Manage Promotions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;