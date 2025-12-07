import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDateTime, formatDate, formatTime } from '../../utils/helpers';
import {
    CalendarCheck,
    Clock,
    Users,
    Banknote,
    Search,
    Filter,
    RefreshCw,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import reservationService from '../../services/reservationService';

const ReservationManagementPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-status-warning bg-status-warning/10';
            case 'confirmed':
                return 'text-status-info bg-status-info/10';
            case 'active':
                return 'text-admin-primary bg-admin-primary/10';
            case 'completed':
                return 'text-status-success bg-status-success/10';
            case 'cancelled':
                return 'text-status-error bg-status-error/10';
            default:
                return 'text-text-muted bg-surface-elevated';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle size={16} />;
            case 'confirmed':
                return <CalendarCheck size={16} />;
            case 'active':
                return <Clock size={16} />;
            case 'completed':
                return <CheckCircle size={16} />;
            case 'cancelled':
                return <XCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const fetchReservations = async () => {
        setLoading(true);
        try {
            // Add minimum delay of 500ms for visual feedback
            const [response] = await Promise.all([
                reservationService.getAllReservations({
                    search: searchTerm,
                    status: statusFilter === 'all' ? undefined : statusFilter
                }),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);

            // Handle the nested response structure: { success: true, data: { reservations: [...], pagination: {...} } }
            let reservationsData = [];
            if (response?.data?.reservations) {
                reservationsData = response.data.reservations;
            } else if (response?.reservations) {
                reservationsData = response.reservations;
            } else if (Array.isArray(response?.data)) {
                reservationsData = response.data;
            } else if (Array.isArray(response)) {
                reservationsData = response;
            }
            setReservations(reservationsData);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [searchTerm, statusFilter]);

    const handleViewDetails = (reservation) => {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };

    const handleUpdateStatus = async (reservationId, newStatus) => {
        try {
            await reservationService.updateReservationStatus(reservationId, newStatus);
            fetchReservations();
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        const matchesSearch = searchTerm === '' ||
            reservation.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.table?.table_number?.toString().includes(searchTerm) ||
            reservation.id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reservation Management</h1>
                    <p className="text-text-secondary">Manage and monitor all customer reservations</p>
                </div>
                <button
                    onClick={fetchReservations}
                    disabled={loading}
                    className="btn btn-outline-admin inline-flex items-center gap-2"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search by customer name, table, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input !pl-14"
                            />
                        </div>
                    </div>
                    <div className="md:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="card p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">All Reservations</h3>
                    <p className="text-text-secondary text-sm">View and manage customer reservations</p>
                </div>

                {loading && filteredReservations.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-text-secondary text-sm border-b border-text-muted/20">
                                        <th className="pb-4 pl-6 font-medium">Reservation ID</th>
                                        <th className="pb-4 font-medium">Customer Details</th>
                                        <th className="pb-4 font-medium">Table</th>
                                        <th className="pb-4 font-medium">Schedule</th>
                                        <th className="pb-4 font-medium">Duration</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium">Total Amount</th>
                                        <th className="pb-4 pr-6 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReservations.map((reservation) => (
                                        <tr key={reservation.id} className="border-b border-text-muted/10 hover:bg-surface-elevated/30 transition-colors">
                                            <td className="py-4 pl-6">
                                                <span className="text-text-mono text-xs bg-surface-elevated px-2 py-1 rounded">
                                                    #{reservation.id ? reservation.id.slice(-8) : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <p className="text-white font-medium">{reservation.customer?.name || 'Guest Customer'}</p>
                                                    {reservation.customer?.email && (
                                                        <p className="text-text-muted text-xs">{reservation.customer.email}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">🎱</span>
                                                    <div>
                                                        <p className="text-white font-medium">Table {reservation.table?.table_number || 'N/A'}</p>
                                                        <p className="text-text-muted text-xs">Billiard Table</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {reservation.start_time ? formatDateTime(reservation.start_time) : 'N/A'}
                                                    </p>
                                                    <p className="text-text-muted text-xs">
                                                        {reservation.end_time ? `to ${formatDateTime(reservation.end_time)}` : ''}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-text-muted" />
                                                    <span className="text-white font-medium">
                                                        {reservation.duration_hours ? `${reservation.duration_hours} hour${reservation.duration_hours > 1 ? 's' : ''}` : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                                    {getStatusIcon(reservation.status)}
                                                    {reservation.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <p className="text-white font-semibold text-lg">
                                                        {formatCurrency(reservation.final_cost || reservation.base_cost || 0)}
                                                    </p>
                                                    <p className="text-text-muted text-xs">Total Payment</p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-6">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleViewDetails(reservation)}
                                                        className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-text-secondary transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {reservation.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                                                            className="p-2 hover:bg-surface-elevated rounded-lg text-status-success hover:text-status-success/80 transition-colors"
                                                            title="Confirm Reservation"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    {reservation.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                                                            className="p-2 hover:bg-surface-elevated rounded-lg text-status-error hover:text-status-error/80 transition-colors"
                                                            title="Cancel Reservation"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredReservations.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CalendarCheck size={24} className="text-text-muted" />
                                </div>
                                <p className="text-text-secondary mb-2">No reservations found</p>
                                <p className="text-text-muted text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedReservation && (
                <div className="modal-overlay">
                    <div className="modal-content max-w-2xl bg-surface border border-text-muted/20 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="modal-header flex justify-between items-center p-6 border-b border-text-muted/10 bg-surface-elevated/10">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Reservation Details
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(selectedReservation.status)} border-current bg-opacity-10`}>
                                        {selectedReservation.status}
                                    </span>
                                </h2>
                                <p className="text-text-muted text-sm mt-1">ID: #{selectedReservation.id}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-surface-elevated rounded-full text-text-muted hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-6 overflow-y-auto space-y-8">
                            {/* Customer & Table Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <Users size={16} /> Customer Info
                                    </h3>
                                    <div className="bg-surface-elevated/50 p-4 rounded-lg space-y-3">
                                        <div>
                                            <p className="text-text-secondary text-xs">Full Name</p>
                                            <p className="text-white font-medium">{selectedReservation.customer?.name || 'Guest Customer'}</p>
                                        </div>
                                        <div>
                                            <p className="text-text-secondary text-xs">Contact Info</p>
                                            <p className="text-white text-sm">{selectedReservation.customer?.email || '-'}</p>
                                            <p className="text-white text-sm">{selectedReservation.customer?.phone || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <CalendarCheck size={16} /> Booking Info
                                    </h3>
                                    <div className="bg-surface-elevated/50 p-4 rounded-lg space-y-3">
                                        <div>
                                            <p className="text-text-secondary text-xs">Table</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-2xl">🎱</span>
                                                <span className="text-white font-bold">Table {selectedReservation.table?.table_number}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-text-secondary text-xs">Date</p>
                                                <p className="text-white text-sm mt-1">
                                                    {formatDate(selectedReservation.start_time)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-text-secondary text-xs">Duration</p>
                                                <p className="text-white text-sm mt-1">{selectedReservation.duration_hours} hours</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-text-secondary text-xs">Time Slot</p>
                                            <p className="text-white text-sm mt-1 font-mono bg-surface-elevated px-2 py-1 rounded inline-block">
                                                {formatTime(selectedReservation.start_time)} - {formatTime(selectedReservation.end_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                                    <Banknote size={16} /> Payment Details
                                </h3>
                                <div className="bg-surface-elevated/30 border border-text-muted/10 rounded-lg p-4">
                                    <div className="flex justify-between items-center py-2 border-b border-text-muted/10">
                                        <span className="text-text-secondary">Base Rate</span>
                                        <span className="text-white">Hourly Rate x {selectedReservation.duration_hours}h</span>
                                    </div>
                                    {selectedReservation.discount > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-text-muted/10 text-status-success">
                                            <span>Discount</span>
                                            <span>- {formatCurrency(selectedReservation.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 mt-1">
                                        <span className="text-lg font-bold text-white">Total Amount</span>
                                        <span className="text-2xl font-bold text-admin-primary">
                                            {formatCurrency(selectedReservation.final_cost || selectedReservation.base_cost || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            {selectedReservation.notes && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Notes</h3>
                                    <div className="bg-status-info/10 border border-status-info/20 p-4 rounded-lg text-sm text-text-primary">
                                        {selectedReservation.notes}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer p-6 border-t border-text-muted/10 flex justify-end gap-3 bg-surface-elevated/30">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="btn btn-outline px-6"
                            >
                                Close
                            </button>
                            {selectedReservation.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(selectedReservation.id, 'confirmed');
                                        setShowDetailModal(false);
                                    }}
                                    className="btn btn-primary-admin px-6"
                                >
                                    Confirm Booking
                                </button>
                            )}
                            {/* Only allow cancellation for pending reservations or active ones if really needed (usually not) */}
                            {selectedReservation.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(selectedReservation.id, 'cancelled');
                                        setShowDetailModal(false);
                                    }}
                                    className="btn btn-danger px-6"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationManagementPage;