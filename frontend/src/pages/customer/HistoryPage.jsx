import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../../services/customerService';
import { formatCurrency, formatDateTime, getReservationStatusText, getStatusColor } from '../../utils/helpers';
import { Calendar, Clock, Filter, Search, ChevronLeft, ChevronRight, Eye, DollarSign, X, Check } from 'lucide-react';

const CustomerHistory = () => {
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
                alert('Reservation cancelled successfully');
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

    const getStatusBadge = (status) => {
        const colorClass = getStatusColor(status);
        return (
            <span className={`badge ${colorClass}`}>
                {getReservationStatusText(status)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Reservation History</h1>
                <p className="text-text-secondary">View and manage all your reservations</p>
            </div>

            {/* Filters and Search */}
            <div className="card p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-3 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search by table number or ID..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input pl-10"
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
                                <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="input"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="expired">Expired</option>
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

            {/* Reservations List */}
            <div className="card">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customer-primary"></div>
                    </div>
                ) : reservations.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-text-secondary text-sm">
                                        <th className="pb-4 font-medium">Reservation ID</th>
                                        <th className="pb-4 font-medium">Table</th>
                                        <th className="pb-4 font-medium">Date & Time</th>
                                        <th className="pb-4 font-medium">Duration</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium">Total Cost</th>
                                        <th className="pb-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map((reservation) => (
                                        <tr key={reservation.id} className="border-t border-text-muted/10">
                                            <td className="py-4 text-sm text-text-primary font-medium">
                                                #{reservation.id}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-customer-primary/10 text-customer-primary px-2 py-1 rounded text-xs font-bold">
                                                        🎱 {reservation.table?.table_number || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm">
                                                <div className="text-text-primary">{formatDateTime(reservation.start_time)}</div>
                                                <div className="text-text-muted text-xs">Created: {formatDateTime(reservation.created_at)}</div>
                                            </td>
                                            <td className="py-4 text-sm text-text-secondary">
                                                {reservation.duration_hours} hours
                                            </td>
                                            <td className="py-4">
                                                {getStatusBadge(reservation.status)}
                                            </td>
                                            <td className="py-4 text-sm font-semibold text-text-primary">
                                                {formatCurrency(reservation.final_cost || reservation.base_cost || 0)}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => viewReservationDetail(reservation)}
                                                        className="p-1 hover:bg-surface-elevated rounded text-text-muted hover:text-text-secondary"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {reservation.status === 'pending' && (
                                                        <Link
                                                            to={`/customer/payment?reservationId=${reservation.id}`}
                                                            className="p-1 hover:bg-surface-elevated rounded text-text-muted hover:text-customer-primary"
                                                        >
                                                            <DollarSign size={16} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-text-muted/10">
                                <div className="text-sm text-text-secondary">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                    {pagination.total} reservations
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
                        <Calendar size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-1">No reservations found</h3>
                        <p className="text-text-secondary mb-4">You haven't made any reservations yet.</p>
                        <Link to="/customer/reservations/new" className="text-customer-primary hover:underline">
                            Book your first game &rarr;
                        </Link>
                    </div>
                )}
            </div>

            {/* Reservation Detail Modal */}
            {showDetailModal && selectedReservation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-white">Reservation Details</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-text-muted hover:text-text-primary"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Reservation ID:</span>
                                <span className="text-white font-medium">#{selectedReservation.id}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Status:</span>
                                {getStatusBadge(selectedReservation.status)}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Table Number:</span>
                                <span className="text-white font-medium">🎱 {selectedReservation.table?.table_number}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Table Type:</span>
                                <span className="text-white font-medium">{selectedReservation.table?.tableType?.name || 'Standard'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Date & Time:</span>
                                <span className="text-white font-medium">{formatDateTime(selectedReservation.start_time)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Duration:</span>
                                <span className="text-white font-medium">{selectedReservation.duration_hours} hours</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Base Cost:</span>
                                <span className="text-white font-medium">{formatCurrency(selectedReservation.base_cost || 0)}</span>
                            </div>
                            {selectedReservation.discount_amount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Discount:</span>
                                    <span className="text-customer-primary font-medium">-{formatCurrency(selectedReservation.discount_amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span className="text-text-secondary">Total Cost:</span>
                                <span className="text-white">{formatCurrency(selectedReservation.final_cost || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Created At:</span>
                                <span className="text-white font-medium">{formatDateTime(selectedReservation.created_at)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            {selectedReservation.status === 'pending' && (
                                <>
                                    <Link
                                        to={`/customer/payment?reservationId=${selectedReservation.id}`}
                                        className="btn btn-primary-customer flex-1 inline-flex items-center justify-center gap-2"
                                        onClick={() => setShowDetailModal(false)}
                                    >
                                        <DollarSign size={16} />
                                        Pay Now
                                    </Link>
                                    <button
                                        onClick={() => handleCancelReservation(selectedReservation.id)}
                                        disabled={cancelling}
                                        className="btn btn-outline-danger flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="btn btn-outline flex-1"
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

export default CustomerHistory;