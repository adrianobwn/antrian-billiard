import React, { useState, useEffect } from 'react';
import customerService from '../../services/customerService';
import { formatDateTime } from '../../utils/helpers';
import { Activity, Calendar, Clock, Filter, Search, ChevronLeft, ChevronRight, Eye, CreditCard, User, LogIn, DollarSign, X } from 'lucide-react';

const ActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        dateFrom: '',
        dateTo: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, [pagination.page, filters]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            };

            // Remove empty filter values
            Object.keys(params).forEach(key => {
                if (params[key] === '') {
                    delete params[key];
                }
            });

            const response = await customerService.getActivityLogs(params);
            if (response.success) {
                setActivities(response.data.activities);
                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        ...response.data.pagination
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const viewActivityDetail = (activity) => {
        setSelectedActivity(activity);
        setShowDetailModal(true);
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'reservation_created':
            case 'reservation_cancelled':
            case 'reservation_updated':
                return <Calendar size={18} className="text-customer-primary" />;
            case 'payment_completed':
            case 'payment_failed':
                return <CreditCard size={18} className="text-status-success" />;
            case 'profile_updated':
                return <User size={18} className="text-admin-accent" />;
            case 'login':
                return <LogIn size={18} className="text-status-info" />;
            default:
                return <Activity size={18} className="text-text-muted" />;
        }
    };

    const getActivityTitle = (activity) => {
        if (!activity || !activity.type) return 'Unknown Activity';

        switch (activity.type) {
            case 'reservation_created':
                return 'Reservation Created';
            case 'reservation_cancelled':
                return 'Reservation Cancelled';
            case 'reservation_updated':
                return 'Reservation Updated';
            case 'payment_completed':
                return 'Payment Completed';
            case 'payment_failed':
                return 'Payment Failed';
            case 'profile_updated':
                return 'Profile Updated';
            case 'login':
                return 'Login';
            case 'logout':
            case 'customer_logout':
                return 'Logout';
            default:
                // Safe string manipulation
                return String(activity.type).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    const getActivityColor = (type) => {
        if (!type) return 'text-text-secondary';

        switch (type) {
            case 'reservation_created':
                return 'text-status-success';
            case 'reservation_cancelled':
                return 'text-status-error';
            case 'reservation_updated':
                return 'text-status-warning';
            case 'payment_completed':
                return 'text-status-success';
            case 'payment_failed':
                return 'text-status-error';
            case 'profile_updated':
                return 'text-admin-accent';
            case 'login':
                return 'text-status-info';
            case 'logout':
            case 'customer_logout':
                return 'text-text-muted';
            default:
                return 'text-text-secondary';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Activity Log</h1>
                <p className="text-text-secondary">Track all your account activities</p>
            </div>

            {/* Filters and Search */}
            <div className="card p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-3 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input !pl-14"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-text-muted/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Activity Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="input"
                                >
                                    <option value="">All Activities</option>
                                    <option value="reservation_created">Reservation Created</option>
                                    <option value="reservation_cancelled">Reservation Cancelled</option>
                                    <option value="reservation_updated">Reservation Updated</option>
                                    <option value="payment_completed">Payment Completed</option>
                                    <option value="payment_failed">Payment Failed</option>
                                    <option value="profile_updated">Profile Updated</option>
                                    <option value="login">Login</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">From Date</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">To Date</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Activities List */}
            <div className="card">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customer-primary"></div>
                    </div>
                ) : activities.length > 0 ? (
                    <>
                        <div className="space-y-1">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-4 p-4 hover:bg-surface-elevated rounded-lg transition-colors cursor-pointer border-b border-text-muted/5 last:border-b-0"
                                    onClick={() => viewActivityDetail(activity)}
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-medium ${getActivityColor(activity.type)}`}>
                                                {getActivityTitle(activity)}
                                            </span>
                                            {activity.metadata?.amount && (
                                                <span className="text-text-primary font-medium">
                                                    {activity.metadata.currency === 'IDR' ? 'Rp ' : '$'}
                                                    {activity.metadata.amount.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-secondary truncate">
                                            {activity.description}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="text-sm text-text-primary">
                                            {formatDateTime(activity.created_at)}
                                        </div>
                                        <div className="text-xs text-text-muted flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(activity.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-text-muted/10">
                                <div className="text-sm text-text-secondary">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                    {pagination.total} activities
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="btn btn-outline p-2 disabled:opacity-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="px-3 py-2 text-sm text-text-secondary">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="btn btn-outline p-2 disabled:opacity-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Activity size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-1">No activities found</h3>
                        <p className="text-text-secondary">Your activity log will appear here once you start using the app.</p>
                    </div>
                )}
            </div>

            {/* Activity Detail Modal */}
            {showDetailModal && selectedActivity && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center">
                                    {getActivityIcon(selectedActivity.type)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{getActivityTitle(selectedActivity)}</h2>
                                    <p className={`text-sm ${getActivityColor(selectedActivity.type)}`}>
                                        {selectedActivity.type ? selectedActivity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-text-muted hover:text-text-primary"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
                                <p className="text-white">{selectedActivity.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-text-secondary mb-2">Date & Time</h3>
                                    <p className="text-white">{formatDateTime(selectedActivity.created_at)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-text-secondary mb-2">IP Address</h3>
                                    <p className="text-white">{selectedActivity.ip_address || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-text-secondary mb-2">Additional Details</h3>
                                    <div className="bg-surface-elevated rounded-lg p-4 space-y-2">
                                        {Object.entries(selectedActivity.metadata).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-text-secondary capitalize">
                                                    {key.replace(/_/g, ' ')}:
                                                </span>
                                                <span className="text-white font-medium">
                                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-text-secondary mb-2">Details</h3>
                                <div className="bg-background/30 rounded-lg p-4 font-mono text-sm text-text-primary overflow-x-auto max-h-60">
                                    {typeof selectedActivity.details === 'string' ? selectedActivity.details : JSON.stringify(selectedActivity.details, null, 2)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="btn btn-outline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityPage;