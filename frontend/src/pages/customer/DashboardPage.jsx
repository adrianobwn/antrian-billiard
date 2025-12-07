import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import customerService from '../../services/customerService';
import { formatCurrency, formatDateTime, getReservationStatusText, getStatusColor } from '../../utils/helpers';
import { CalendarPlus, Clock, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import PoolTableVisual from '../../components/common/PoolTableVisual';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get dashboard statistics
                const statsData = await customerService.getDashboardStats();
                if (statsData.success) {
                    setStats(statsData.data);
                }

                // Get recent reservations
                if (statsData.data?.recentReservations) {
                    setReservations(statsData.data.recentReservations);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            {!loading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6 border-l-4 border-l-customer-primary">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-text-secondary text-sm font-medium">Total Reservations</h3>
                            <TrendingUp className="text-customer-primary" size={20} />
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.stats.totalReservations || 0}</p>
                    </div>
                    <div className="card p-6 border-l-4 border-l-status-info">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-text-secondary text-sm font-medium">Active</h3>
                            <Clock className="text-status-info" size={20} />
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.stats.activeReservations || 0}</p>
                    </div>
                    <div className="card p-6 border-l-4 border-l-status-success">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-text-secondary text-sm font-medium">Completed</h3>
                            <Calendar className="text-status-success" size={20} />
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.stats.completedReservations || 0}</p>
                    </div>
                    <div className="card p-6 border-l-4 border-l-admin-accent">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-text-secondary text-sm font-medium">Member Since</h3>
                            <CalendarPlus className="text-admin-accent" size={20} />
                        </div>
                        <p className="text-lg font-bold text-white">
                            {new Date(user?.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            )}

            {/* Hero / Welcome */}
            <div className="bg-gradient-to-r from-customer-primary/20 to-surface-elevated p-8 rounded-2xl border border-customer-primary/20">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || user?.name}!</h1>
                <p className="text-text-secondary mb-6 max-w-xl">
                    Ready for a game? Book your favorite table now and enjoy the best billiard experience.
                </p>
                <Link to="/customer/reservations/new" className="btn btn-primary-customer inline-flex items-center gap-2">
                    <CalendarPlus size={20} /> Book a Table
                </Link>
            </div>

            {/* Recent Reservations */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock size={24} className="text-customer-primary" /> Recent Reservations
                </h2>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-customer-primary"></div>
                            <span className="text-text-secondary">Loading...</span>
                        </div>
                    </div>
                ) : reservations.length > 0 ? (
                    <div className="space-y-4">
                        {reservations.map(res => (
                            <div key={res.id} className="card hover:border-customer-primary/50 transition-all">
                                <div className="p-6">
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-shrink-0">
                                            <PoolTableVisual
                                                table={{
                                                    number: res.table?.table_number || 'N/A',
                                                    status: (res.status === 'confirmed' || res.status === 'active') ? 'occupied' :
                                                        (res.status === 'pending') ? 'reserved' :
                                                            'available'
                                                }}
                                                size="small"
                                                showStatus={false}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className={`badge ${getStatusColor(res.status)}`}>
                                                        {getReservationStatusText(res.status)}
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-white mt-2">
                                                        Table {res.table?.table_number || 'N/A'}
                                                    </h3>
                                                </div>
                                                <span className="text-text-muted text-sm">
                                                    {formatDateTime(res.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {formatDateTime(res.start_time)}
                                        </h3>
                                        <p className="text-text-secondary flex items-center gap-2">
                                            <Clock size={16} />
                                            Duration: {res.duration_hours} hours
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-text-muted/10">
                                        <span className="text-text-muted">
                                            Table Type: {res.table?.tableType?.name || 'Standard'}
                                        </span>
                                        <span className="text-text-primary font-semibold">
                                            {formatCurrency(res.final_cost || res.base_cost || 0)}
                                        </span>
                                    </div>
                                    {res.status === 'pending' && (
                                        <div className="mt-4">
                                            <Link
                                                to={`/customer/payment?reservationId=${res.id}`}
                                                className="btn btn-primary-customer w-full inline-flex items-center justify-center gap-2"
                                            >
                                                <DollarSign size={16} />
                                                Pay Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-surface-elevated rounded-lg border border-text-muted/10">
                        <Calendar size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-1">No reservations yet</h3>
                        <p className="text-text-secondary mb-4">You haven't booked any tables yet.</p>
                        <Link to="/customer/reservations/new" className="text-customer-primary hover:underline">
                            Book your first game &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
