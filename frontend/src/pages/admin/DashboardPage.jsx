import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { DollarSign, Hash, CalendarCheck, Users } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="card p-6 flex items-start justify-between">
        <div>
            <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        activeTables: 0,
        todayReservations: 0,
        totalCustomers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming an endpoint exists or we aggregate manually. 
                // Using a hypothetical dashboard stats endpoint based on README
                const response = await api.get('/admin/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                // Fallback mock data if endpoint is not ready
                setStats({
                    revenue: 0,
                    activeTables: 0,
                    todayReservations: 0,
                    totalCustomers: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`Rp ${stats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-status-success text-status-success"
                />
                <StatCard
                    title="Active Tables"
                    value={stats.activeTables}
                    icon={Hash}
                    colorClass="bg-status-info text-status-info"
                />
                <StatCard
                    title="Today's Reservations"
                    value={stats.todayReservations}
                    icon={CalendarCheck}
                    colorClass="bg-status-warning text-status-warning"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    colorClass="bg-purple-500 text-purple-500"
                />
            </div>

            {/* Recent Activity / Quick Actions could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 h-64 flex flex-col justify-center items-center text-text-muted">
                    <p>Revenue Chart Placeholder</p>
                </div>
                <div className="card p-6 h-64 flex flex-col justify-center items-center text-text-muted">
                    <p>Recent Bookings Placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
