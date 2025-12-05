import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import reservationService from '../../services/reservationService';
import { CalendarPlus, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                // Assuming getAll returns all reservations for the logged-in user
                const data = await reservationService.getAll();
                // Filter for upcoming only (client-side for now if API returns all)
                const upcoming = data.filter(r => new Date(r.reservation_time) > new Date()).slice(0, 3);
                setReservations(upcoming);
            } catch (error) {
                console.error("Failed to fetch reservations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div className="space-y-8">
            {/* Hero / Welcome */}
            <div className="bg-gradient-to-r from-customer-primary/20 to-surface-elevated p-8 rounded-2xl border border-customer-primary/20">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
                <p className="text-text-secondary mb-6 max-w-xl">
                    Ready for a game? Book your favorite table now and enjoy the best billiard experience.
                </p>
                <Link to="/customer/reservations/new" className="btn btn-primary-customer inline-flex items-center gap-2">
                    <CalendarPlus size={20} /> Book a Table
                </Link>
            </div>

            {/* Upcoming Reservations */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock size={24} className="text-customer-primary" /> Upcoming Reservations
                </h2>

                {loading ? (
                    <div className="text-text-muted">Loading...</div>
                ) : reservations.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {reservations.map(res => (
                            <div key={res.id} className="card p-5 hover:border-customer-primary/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-customer-primary/10 text-customer-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        Table {res.table_id}
                                    </div>
                                    <span className="text-text-muted text-xs">
                                        {format(new Date(res.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {format(new Date(res.reservation_time), 'EEEE, MMMM d')}
                                    </h3>
                                    <p className="text-text-secondary flex items-center gap-2">
                                        <Clock size={16} />
                                        {format(new Date(res.reservation_time), 'h:mm a')}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-4 border-t border-text-muted/10">
                                    <span className="text-text-muted">{res.duration_minutes} Minutes</span>
                                    <span className={`badge ${res.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                        {res.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-surface-elevated rounded-lg border border-text-muted/10 dashed-border">
                        <Calendar size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-1">No upcoming reservations</h3>
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
