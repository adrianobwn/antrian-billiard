import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import tableService from '../../services/tableService';
import reservationService from '../../services/reservationService';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { Calendar, Clock, CheckCircle, DollarSign, Tag, Info } from 'lucide-react';
import PoolTableVisual from '../../components/common/PoolTableVisual';

const reservationSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    duration: z.coerce.number().min(30, 'Minimum 30 minutes').max(300, 'Maximum 5 hours'),
    tableId: z.string().min(1, 'Please select a table'),
    promoCode: z.string().optional(),
});

const ReservationPage = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [error, setError] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [priceCalculation, setPriceCalculation] = useState(null);
    const [promoApplied, setPromoApplied] = useState(null);

    // Form setup
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            duration: 60,
        }
    });

    const watchedTableId = watch('tableId');
    const watchedDate = watch('date');
    const watchedTime = watch('time');
    const watchedDuration = watch('duration');
    const watchedPromoCode = watch('promoCode');

    // Fetch all tables on mount
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await tableService.getAll();
                setTables(data || []);
            } catch (err) {
                console.error("Failed to fetch tables", err);
                setError("Failed to load tables. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    // Check availability when date/time changes
    useEffect(() => {
        if (watchedDate && watchedTime) {
            checkTableAvailability();
        }
    }, [watchedDate, watchedTime, watchedDuration]);

    // Update selected table details
    useEffect(() => {
        if (watchedTableId) {
            const table = tables.find(t => t.id === watchedTableId);
            setSelectedTable(table);
            calculatePrice(table, watchedDuration, watchedPromoCode);
        } else {
            setSelectedTable(null);
            setPriceCalculation(null);
        }
    }, [watchedTableId, watchedDuration, watchedPromoCode, tables]);

    const checkTableAvailability = async () => {
        if (!watchedDate || !watchedTime) return;

        setCheckingAvailability(true);
        try {
            const params = {
                date: watchedDate,
                time: watchedTime,
                duration: watchedDuration || 60
            };
            const data = await tableService.getAvailable(params);
            setAvailableTables(data || []);
        } catch (err) {
            console.error("Failed to check availability", err);
            // Fall back to showing all tables with 'available' status
            setAvailableTables(tables.filter(t => t.status === 'available'));
        } finally {
            setCheckingAvailability(false);
        }
    };

    const calculatePrice = (table, duration, promoCode) => {
        if (!table || !table.tableType) return;

        const hours = (duration || 60) / 60;
        const baseCost = table.tableType.hourly_rate * hours;

        let discount = 0;
        let discountType = null;
        let finalCost = baseCost;

        if (promoCode) {
            // Simple local promo validation (actual validation on backend)
            if (promoCode.toUpperCase() === 'WELCOME10') {
                discountType = 'percentage';
                discount = baseCost * 0.1;
                finalCost = baseCost - discount;
                setPromoApplied({ code: promoCode, discount: '10%', amount: discount });
            } else if (promoCode.toUpperCase() === 'WEEKEND20') {
                // Check if it's weekend
                const reservationDate = new Date(watchedDate);
                const isWeekend = reservationDate.getDay() === 0 || reservationDate.getDay() === 6;
                if (isWeekend) {
                    discountType = 'percentage';
                    discount = baseCost * 0.2;
                    finalCost = baseCost - discount;
                    setPromoApplied({ code: promoCode, discount: '20%', amount: discount });
                } else {
                    setPromoApplied({ code: promoCode, error: 'Weekend promo only valid on weekends' });
                    finalCost = baseCost;
                }
            } else if (promoCode.toUpperCase() === 'FIXED25K') {
                discountType = 'fixed';
                discount = 25000;
                finalCost = Math.max(0, baseCost - discount);
                setPromoApplied({ code: promoCode, discount: 'Rp 25,000', amount: discount });
            } else {
                setPromoApplied({ code: promoCode, error: 'Invalid promo code' });
                finalCost = baseCost;
            }
        } else {
            setPromoApplied(null);
        }

        setPriceCalculation({
            baseCost,
            discount,
            finalCost,
            duration: hours
        });
    };

    const onSubmit = async (data) => {
        setError('');
        try {
            const startTime = new Date(`${data.date}T${data.time}`);
            const endTime = new Date(startTime.getTime() + data.duration * 60000);

            const payload = {
                table_id: data.tableId,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                notes: `Booked via Customer Portal`
            };

            // Add promo code if provided
            if (data.promoCode) {
                payload.promo_code = data.promoCode;
            }

            const response = await reservationService.create(payload);

            if (response.success) {
                // Redirect to payment page with the reservation ID
                navigate(`/customer/payment?reservationId=${response.data.reservation.id}`);
            } else {
                setError('Failed to create reservation');
            }
        } catch (err) {
            console.error("Reservation failed", err);
            setError(err.response?.data?.error?.message || err.response?.data?.message || "Failed to make reservation");
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

                    {watchedDate && watchedTime && checkingAvailability && (
                        <div className="flex items-center gap-2 text-text-secondary">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-customer-primary"></div>
                            <span>Checking availability...</span>
                        </div>
                    )}

                    {tables.length === 0 ? (
                        <div className="text-text-secondary text-center py-4">No tables available.</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tables.map(table => {
                                    const isAvailable = watchedDate && watchedTime
                                        ? availableTables.some(t => t.id === table.id)
                                        : table.status === 'available';

                                    const isUnavailable = table.status === 'occupied' || (watchedDate && watchedTime && !isAvailable);

                                    return (
                                        <div
                                            key={table.id}
                                            onClick={() => !isUnavailable && setValue('tableId', table.id)}
                                            className={`
                                                cursor-pointer rounded-lg p-6 border-2 transition-all relative
                                                ${watchedTableId === table.id
                                                    ? 'border-customer-primary bg-customer-primary/10'
                                                    : 'border-text-muted/20 hover:border-customer-primary/50 bg-surface-elevated'}
                                                ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <div className="flex flex-col items-center">
                                                <PoolTableVisual
                                                    table={{
                                                        number: table.table_number || table.number,
                                                        status: isAvailable ? 'available' : 'unavailable'
                                                    }}
                                                    size="medium"
                                                    showStatus={false}
                                                    interactive={!isUnavailable}
                                                />

                                                <div className="mt-4 text-center">
                                                    <div className="font-bold text-lg text-white mb-1">Table {table.table_number || table.number}</div>
                                                    <div className="text-sm text-text-secondary mb-2">{table.tableType?.name || 'Standard'}</div>
                                                    <div className="text-sm text-text-primary font-semibold mb-2">
                                                        {formatCurrency(table.tableType?.hourly_rate || 0)}/hour
                                                    </div>
                                                    <div className={`text-sm capitalize px-3 py-1 rounded-full inline-block ${isAvailable
                                                        ? 'bg-status-success/20 text-status-success'
                                                        : 'bg-status-error/20 text-status-error'
                                                        }`}>
                                                        {watchedDate && watchedTime
                                                            ? (isAvailable ? 'Available' : 'Unavailable')
                                                            : table.status
                                                        }
                                                    </div>
                                                </div>

                                                {watchedTableId === table.id && (
                                                    <div className="absolute top-2 right-2 bg-customer-primary text-white p-1 rounded-full">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {watchedDate && watchedTime && (
                                <p className="text-sm text-text-muted flex items-center gap-2">
                                    <Info size={16} />
                                    Showing availability for {watchedDate} at {watchedTime}
                                </p>
                            )}
                        </>
                    )}
                    {errors.tableId && <p className="text-status-error text-sm mt-1">{errors.tableId.message}</p>}
                </div>

                {/* 3. Promo Code */}
                <div className="card p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Tag className="text-customer-primary" /> Promo Code (Optional)
                    </h2>
                    <div className="max-w-md">
                        <input
                            type="text"
                            placeholder="Enter promo code"
                            {...register('promoCode')}
                            className="input text-white"
                        />
                        {promoApplied && (
                            <div className={`mt-2 text-sm ${promoApplied.error ? 'text-status-error' : 'text-status-success'}`}>
                                {promoApplied.error
                                    ? promoApplied.error
                                    : `Promo applied: ${promoApplied.discount} (-${formatCurrency(promoApplied.amount)})`
                                }
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-text-muted">
                        Available codes: WELCOME10 (10% off), WEEKEND20 (20% off weekends), FIXED25K (Rp 25,000 off)
                    </div>
                </div>

                {/* 4. Price Summary */}
                {priceCalculation && selectedTable && (
                    <div className="card p-6 bg-surface-elevated border border-customer-primary/20">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <DollarSign className="text-customer-primary" /> Price Summary
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-text-secondary">
                                <span>Table {selectedTable.table_number || selectedTable.number} ({selectedTable.tableType?.name})</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Duration: {priceCalculation.duration} hour{priceCalculation.duration !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Base Price:</span>
                                <span>{formatCurrency(priceCalculation.baseCost)}</span>
                            </div>
                            {priceCalculation.discount > 0 && (
                                <div className="flex justify-between text-status-success">
                                    <span>Discount:</span>
                                    <span>-{formatCurrency(priceCalculation.discount)}</span>
                                </div>
                            )}
                            <div className="border-t border-text-muted/20 pt-2 mt-2">
                                <div className="flex justify-between text-lg font-bold text-white">
                                    <span>Total:</span>
                                    <span className="text-customer-primary">{formatCurrency(priceCalculation.finalCost)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
