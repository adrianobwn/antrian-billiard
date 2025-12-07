import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../../services/customerService';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { Calendar, Clock, Filter, Search, ChevronLeft, ChevronRight, Eye, DollarSign, X, Check, ArrowRight } from 'lucide-react';
import PoolTableVisual from '../../components/common/PoolTableVisual';

const CustomerHistory = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, [pagination.page, filters]);

    const fetchReservations = async () => {
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

            const response = await customerService.getReservations(params);
            if (response.success) {
                setReservations(response.data.reservations);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.total,
                    totalPages: Math.ceil(response.data.total / response.data.limit)
                }));
            }
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Reset to page 1 when filter changes
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const viewReservationDetail = (reservation) => {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };

    const handleCancelReservation = async (reservationId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return;
        }

        setCancelling(true);
        try {
            const response = await customerService.cancelReservation(reservationId);
            if (response.success) {
                fetchReservations();
                setShowDetailModal(false);
                // Optionally show a toast/notification
            } else {
                alert(response.message || 'Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Failed to cancel reservation:', error);
            alert('Failed to cancel reservation');
        } finally {
            setCancelling(false);
        }
    };

    // Helper to get consistent visual status for card
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-status-warning/10 text-status-warning border-status-warning/20',
            confirmed: 'bg-status-success/10 text-status-success border-status-success/20',
            active: 'bg-customer-accent/10 text-customer-accent border-customer-accent/20',
            completed: 'bg-surface-elevated text-text-muted border-text-muted/10',
            cancelled: 'bg-status-error/10 text-status-error border-status-error/20',
            expired: 'bg-surface-elevated text-text-muted border-text-muted/10',
            rejected: 'bg-status-error/10 text-status-error border-status-error/20'
        };
        return colors[status] || colors.pending;
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            active: 'Playing Now',
            completed: 'Completed',
            cancelled: 'Cancelled',
            expired: 'Expired',
            rejected: 'Rejected'
        };
        return labels[status] || status;
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Reservation History</h1>
                    <p className="text-text-secondary">Track all your past and upcoming games</p>
                </div>
                <Link to="/customer/reservations/new" className="btn btn-primary-customer shadow-lg shadow-customer-primary/20">
                    + New Booking
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4 border border-text-muted/10 bg-surface/50 backdrop-blur-sm sticky top-[72px] z-30 shadow-lg margin-fix">
                <div className="flex flex-col xl:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search ID or Table..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input !pl-10 w-full bg-background/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Status Filter Tabs */}
                        <div className="flex bg-background/50 p-1 rounded-lg border border-text-muted/10 overflow-x-auto max-w-full">
                            {['', 'confirmed', 'cancelled', 'completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange('status', status)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filters.status === status
                                            ? 'bg-customer-primary text-white shadow-md'
                                            : 'text-text-secondary hover:text-white hover:bg-surface-elevated'
                                        }`}
                                >
                                    {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Date Toggles */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn btn-outline p-2 ${showFilters ? 'bg-surface-elevated text-white' : ''}`}
                            title="More Filters"
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-text-muted/10 animate-slideDown">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-medium text-text-secondary mb-1 block">From Date</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    className="input w-full bg-background/50 text-sm"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-medium text-text-secondary mb-1 block">To Date</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    className="input w-full bg-background/50 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reservation Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card h-64 bg-surface-elevated/50"></div>
                    ))}
                </div>
            ) : reservations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="group card p-0 overflow-hidden hover:shadow-xl hover:shadow-customer-primary/5 transition-all duration-300 border border-text-muted/10 bg-surface/50 relative"
                        >
                            {/* Status Stripe */}
                            <div className={`h-1 w-full ${reservation.status === 'confirmed' ? 'bg-status-success' :
                                    reservation.status === 'cancelled' ? 'bg-status-error' :
                                        reservation.status === 'pending' ? 'bg-status-warning' :
                                            'bg-text-muted'
                                }`}></div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <PoolTableVisual
                                            table={{
                                                number: reservation.table?.table_number,
                                                status: 'available' // Always show clean visual without 'maintenance' badge
                                            }}
                                            size="small"
                                            showStatus={false}
                                            className="transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div>
                                            <h3 className="font-bold text-white text-lg">
                                                Table {reservation.table?.table_number}
                                            </h3>
                                            <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block border ${getStatusColor(reservation.status)}`}>
                                                {getStatusLabel(reservation.status)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-text-secondary mb-1">Total Cost</div>
                                        <div className="font-bold text-customer-primary text-lg">
                                            {formatCurrency(reservation.final_cost || reservation.base_cost)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-text-secondary bg-background/50 p-3 rounded-lg border border-text-muted/5">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-customer-primary" />
                                        <span className="text-white">{formatDateTime(reservation.start_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-customer-primary" />
                                        <span>{reservation.duration_hours} Hour(s) Duration</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs pt-1 border-t border-text-muted/10 mt-1">
                                        <span className="font-mono opacity-50">#{reservation.id.slice(0, 8)}...</span>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2">
                                    <button
                                        onClick={() => viewReservationDetail(reservation)}
                                        className="btn btn-outline flex-1 text-sm py-2 hover:bg-surface-elevated hover:text-white border-dashed"
                                    >
                                        Details
                                    </button>

                                    {reservation.status === 'pending' && (
                                        <button
                                            onClick={() => navigate(`/customer/payment?reservationId=${reservation.id}`)}
                                            className="btn btn-primary-customer flex-1 text-sm py-2 shadow-lg shadow-customer-primary/10"
                                        >
                                            Pay Now
                                        </button>
                                    )}

                                    {reservation.status === 'confirmed' && (
                                        <div className="flex-1 flex items-center justify-center text-status-success text-xs font-bold bg-status-success/5 rounded border border-status-success/10">
                                            <Check size={14} className="mr-1" /> Ready
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface/30 rounded-2xl border-2 border-dashed border-text-muted/10">
                    <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Reservations Found</h3>
                    <p className="text-text-secondary mb-6 max-w-md mx-auto">
                        {filters.status || filters.search
                            ? "Try adjusting your filters to see more results."
                            : "You haven't made any reservations yet. Start your game now!"}
                    </p>
                    {(filters.status || filters.search) ? (
                        <button
                            onClick={() => {
                                setFilters({ status: '', search: '', dateFrom: '', dateTo: '' });
                            }}
                            className="btn btn-outline"
                        >
                            Clear Filters
                        </button>
                    ) : (
                        <Link to="/customer/reservations/new" className="btn btn-primary-customer">
                            Book a Table
                        </Link>
                    )}
                </div>
            )}

            {/* Pagination (Simplified) */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-full hover:bg-surface-elevated disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-sm font-medium text-text-secondary">
                        Page <span className="text-white">{pagination.page}</span> of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-full hover:bg-surface-elevated disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedReservation && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-surface border border-text-muted/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-1">Reservation Details</h2>
                            <p className="text-sm text-text-secondary mb-6">ID: #{selectedReservation.id}</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-surface-elevated/50 rounded-xl border border-text-muted/10">
                                    <PoolTableVisual
                                        table={{
                                            number: selectedReservation.table?.table_number,
                                            status: 'available'
                                        }}
                                        size="small"
                                        showStatus={false}
                                    />
                                    <div>
                                        <div className="text-lg font-bold text-white">Table {selectedReservation.table?.table_number}</div>
                                        <div className="text-sm text-text-secondary">{selectedReservation.table?.tableType?.name}</div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between py-2 border-b border-text-muted/10">
                                        <span className="text-text-secondary">Status</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(selectedReservation.status)}`}>
                                            {getStatusLabel(selectedReservation.status)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-text-muted/10">
                                        <span className="text-text-secondary">Date</span>
                                        <span className="text-white font-medium">{formatDateTime(selectedReservation.start_time)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-text-muted/10">
                                        <span className="text-text-secondary">Duration</span>
                                        <span className="text-white font-medium">{selectedReservation.duration_hours} Hours</span>
                                    </div>
                                    <div className="flex justify-between py-2 items-center">
                                        <span className="text-text-secondary font-medium">Total Cost</span>
                                        <span className="text-xl font-bold text-customer-primary">
                                            {formatCurrency(selectedReservation.final_cost || selectedReservation.base_cost)}
                                        </span>
                                    </div>
                                </div>

                                {selectedReservation.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <button
                                            onClick={() => handleCancelReservation(selectedReservation.id)}
                                            disabled={cancelling}
                                            className="btn btn-outline-danger py-3 text-sm"
                                        >
                                            {cancelling ? '...' : 'Cancel'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                navigate(`/customer/payment?reservationId=${selectedReservation.id}`);
                                            }}
                                            className="btn btn-primary-customer py-3 text-sm shadow-lg shadow-customer-primary/20"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerHistory;