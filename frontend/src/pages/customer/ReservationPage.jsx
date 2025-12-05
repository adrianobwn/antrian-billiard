import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import tableService from '../../services/tableService';
import reservationService from '../../services/reservationService';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const reservationSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    duration: z.coerce.number().min(30, 'Minimum 30 minutes').max(300, 'Maximum 5 hours'),
    tableId: z.string().min(1, 'Please select a table'),
});

const ReservationPage = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form setup
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            duration: 60,
        }
    });

    const selectedTable = watch('tableId');

    useEffect(() => {
        const fetchTables = async () => {
            try {
                // In a real app, we might filter by availability for the selected date/time here
                // For now, we fetch all tables.
                const data = await tableService.getAll(); // Or getAvailable() if implemented
                setTables(data);
            } catch (err) {
                console.error("Failed to fetch tables", err);
                setError("Failed to load tables. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    const onSubmit = async (data) => {
        setError('');
        try {
            const reservationDate = new Date(`${data.date}T${data.time}`);

            await reservationService.create({
                table_id: data.tableId,
                reservation_time: reservationDate.toISOString(),
                duration_minutes: data.duration
                // promo_code: data.promoCode 
            });

            navigate('/customer/dashboard');
        } catch (err) {
            console.error("Reservation failed", err);
            setError(err.response?.data?.error?.message || "Failed to make reservation");
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading available tables...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Book a Table</h1>

            {error && (
                <div className="bg-status-error/10 border border-status-error text-status-error p-4 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* 1. Select Date & Time */}
                <div className="card p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-customer-primary" /> Select Date & Time
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="input text-white"
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.date && <p className="text-status-error text-sm mt-1">{errors.date.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Time</label>
                            <input
                                type="time"
                                {...register('time')}
                                className="input text-white"
                            />
                            {errors.time && <p className="text-status-error text-sm mt-1">{errors.time.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Duration (Minutes)</label>
                            <select {...register('duration')} className="input text-white">
                                <option value="30">30 Minutes</option>
                                <option value="60">1 Hour</option>
                                <option value="90">1.5 Hours</option>
                                <option value="120">2 Hours</option>
                                <option value="180">3 Hours</option>
                                <option value="240">4 Hours</option>
                                <option value="300">5 Hours</option>
                            </select>
                            {errors.duration && <p className="text-status-error text-sm mt-1">{errors.duration.message}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Select Table */}
                <div className="card p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CheckCircle className="text-customer-primary" /> Select Table
                    </h2>

                    {tables.length === 0 ? (
                        <div className="text-text-secondary text-center py-4">No tables available.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tables.map(table => (
                                <div
                                    key={table.id}
                                    onClick={() => setValue('tableId', table.id)}
                                    className={`
                                        cursor-pointer rounded-lg p-4 border-2 transition-all text-center
                                        ${selectedTable === table.id
                                            ? 'border-customer-primary bg-customer-primary/10'
                                            : 'border-text-muted/20 hover:border-customer-primary/50 bg-surface-elevated'}
                                        ${table.status === 'occupied' ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <div className="font-bold text-white mb-1">Table {table.number}</div>
                                    <div className="text-xs text-text-secondary capitalize">{table.status}</div>
                                    {selectedTable === table.id && (
                                        <div className="mt-2 text-customer-primary text-xs font-bold flex justify-center items-center gap-1">
                                            <CheckCircle size={12} /> Selected
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.tableId && <p className="text-status-error text-sm mt-1">{errors.tableId.message}</p>}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary-customer w-full md:w-auto px-8 py-3 text-lg"
                    >
                        {isSubmitting ? 'Booking...' : 'Confirm Reservation'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationPage;
