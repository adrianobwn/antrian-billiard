import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import reservationService from '../../services/reservationService';
import paymentService from '../../services/paymentService';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import {
    Banknote,
    Smartphone,
    CheckCircle,
    ArrowLeft,
    AlertCircle,
    Clock,
    Calendar,
    Receipt
} from 'lucide-react';

const paymentSchema = z.object({
    paymentMethod: z.enum(['cash', 'ewallet'], {
        required_error: 'Please select a payment method'
    }),
    ewalletProvider: z.string().optional(),
    ewalletPhone: z.string().optional(),
}).refine((data) => {
    if (data.paymentMethod === 'ewallet') {
        return data.ewalletProvider && data.ewalletPhone;
    }
    return true;
}, {
    message: 'Please fill in all required fields per method',
    path: ['paymentMethod']
});

const PaymentPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reservationId = searchParams.get('reservationId');

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentMethod: 'ewallet'
        }
    });

    const selectedPaymentMethod = watch('paymentMethod');

    useEffect(() => {
        if (!reservationId) {
            navigate('/customer/history');
            return;
        }

        fetchReservationDetails();
    }, [reservationId, navigate]);

    const fetchReservationDetails = async () => {
        try {
            const response = await reservationService.getById(reservationId);
            if (response.success) {
                setReservation(response.data.reservation);
            }
        } catch (err) {
            console.error('Failed to fetch reservation:', err);
            setError('Failed to load reservation details');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setProcessing(true);
        setError('');

        try {
            // Demo payment data
            // In a real app, this would be handled by payment gateway
            const response = await paymentService.simulatePayment(reservationId, data.paymentMethod);

            if (response.success) {
                setSuccess(true);
                setReservation(prev => ({
                    ...prev,
                    status: 'confirmed',
                    payment_status: 'paid'
                }));
            }
        } catch (err) {
            console.error('Payment failed:', err);
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-9rem)] w-full flex items-center justify-center bg-background overflow-hidden">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customer-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="h-[calc(100vh-9rem)] w-full flex items-center justify-center bg-background overflow-hidden">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle className="mx-auto text-status-error mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-white mb-2">Reservation Not Found</h2>
                    <p className="text-text-secondary mb-6">The reservation you're trying to pay for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/customer/history')}
                        className="btn btn-primary-customer"
                    >
                        Back to Reservations
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="h-[calc(100vh-9rem)] w-full flex items-center justify-center bg-background p-4 overflow-hidden">
                <div className="max-w-md w-full mx-auto animate-fadeIn">
                    <div className="card p-8 border border-status-success/30 bg-surface-elevated/50 backdrop-blur-sm shadow-xl shadow-status-success/5 relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-status-success shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-status-success/20">
                                <CheckCircle className="text-status-success drop-shadow-lg" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                            <p className="text-text-secondary">Your table has been confirmed.</p>
                        </div>

                        <div className="bg-background/50 rounded-lg p-6 mb-6 border border-text-muted/10">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-text-muted/10">
                                <span className="text-text-secondary text-sm">Amount Paid</span>
                                <span className="text-xl font-bold text-customer-primary">
                                    {formatCurrency(reservation.final_cost || reservation.base_cost)}
                                </span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Reservation ID</span>
                                    <span className="text-white font-mono">#{reservation.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Date</span>
                                    <span className="text-white">{new Date(reservation.start_time).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Time</span>
                                    <span className="text-white">
                                        {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate('/customer/dashboard')}
                                className="btn btn-outline border-text-muted/20 hover:border-text-white hover:text-white"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/customer/history')}
                                className="btn btn-primary-customer shadow-lg shadow-customer-primary/20"
                            >
                                My Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-9rem)] w-full bg-background flex flex-col overflow-hidden animate-fadeIn">
            <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="max-w-5xl mx-auto h-full flex flex-col justify-center">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                        <button
                            onClick={() => navigate('/customer/history')}
                            className="p-2 hover:bg-surface-elevated rounded-full transition-colors text-text-secondary hover:text-white"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Checkout</h1>
                            <p className="text-text-secondary text-sm">Complete your payment to secure the table.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-status-error/10 border border-status-error text-status-error p-4 rounded-lg mb-6 flex items-center gap-3">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: Payment Methods */}
                        <div className="lg:col-span-2 space-y-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="card p-0 overflow-hidden border border-text-muted/10 shadow-xl bg-surface/50 backdrop-blur-sm">
                                    <div className="p-6 border-b border-text-muted/10 bg-surface-elevated/30">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Banknote size={20} className="text-customer-primary" />
                                            Payment Method
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <label className="relative">
                                                <input
                                                    type="radio"
                                                    {...register('paymentMethod')}
                                                    value="ewallet"
                                                    className="peer sr-only"
                                                />
                                                <div className="p-4 rounded-xl border-2 border-text-muted/20 hover:border-customer-primary/50 cursor-pointer transition-all peer-checked:border-customer-primary peer-checked:bg-customer-primary/5 bg-background/50 h-full">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-customer-primary/10 flex items-center justify-center text-customer-primary">
                                                            <Smartphone size={20} />
                                                        </div>
                                                        <span className="font-semibold text-white">E-Wallet</span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary pl-[52px]">GoPay, OVO, DANA, ShopeePay</p>
                                                </div>
                                                <div className="absolute top-4 right-4 text-customer-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <CheckCircle size={20} className="fill-customer-primary text-background" />
                                                </div>
                                            </label>

                                            <label className="relative">
                                                <input
                                                    type="radio"
                                                    {...register('paymentMethod')}
                                                    value="cash"
                                                    className="peer sr-only"
                                                />
                                                <div className="p-4 rounded-xl border-2 border-text-muted/20 hover:border-customer-primary/50 cursor-pointer transition-all peer-checked:border-customer-primary peer-checked:bg-customer-primary/5 bg-background/50 h-full">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-customer-primary/10 flex items-center justify-center text-customer-primary">
                                                            <Banknote size={20} />
                                                        </div>
                                                        <span className="font-semibold text-white">Cash</span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary pl-[52px]">Pay directly at the cashier</p>
                                                </div>
                                                <div className="absolute top-4 right-4 text-customer-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <CheckCircle size={20} className="fill-customer-primary text-background" />
                                                </div>
                                            </label>
                                        </div>

                                        {/* E-Wallet Form */}
                                        {selectedPaymentMethod === 'ewallet' && (
                                            <div className="animate-slideDown pt-4 border-t border-text-muted/10">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-medium text-text-secondary">E-Wallet Provider</label>
                                                        <select
                                                            {...register('ewalletProvider')}
                                                            className="input w-full bg-background/50"
                                                        >
                                                            <option value="">Select Provider</option>
                                                            <option value="gopay">GoPay</option>
                                                            <option value="ovo">OVO</option>
                                                            <option value="dana">DANA</option>
                                                            <option value="shopeepay">ShopeePay</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            {...register('ewalletPhone')}
                                                            placeholder="0812..."
                                                            className="input w-full bg-background/50"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 w-full btn btn-primary-customer py-4 text-lg font-bold shadow-lg shadow-customer-primary/20 hover:shadow-customer-primary/40 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay Now
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card p-0 overflow-hidden border border-text-muted/10 shadow-xl bg-surface/50 backdrop-blur-sm sticky top-6">
                                <div className="p-6 border-b border-text-muted/10 bg-surface-elevated/30">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Receipt size={20} className="text-customer-primary" />
                                        Order Summary
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <p className="text-sm text-text-muted mb-1">Reservation Date</p>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <Calendar size={16} className="text-customer-primary" />
                                            {formatDateTime(reservation.start_time)}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-text-muted mb-1">Duration & Table</p>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <Clock size={16} className="text-customer-primary" />
                                            {reservation.duration_hours} Hour(s) @ Table {reservation.table?.table_number}
                                        </div>
                                        <p className="text-sm text-text-secondary mt-1 ml-6">
                                            {reservation.table?.tableType?.name}
                                        </p>
                                    </div>

                                    <div className="border-t border-text-muted/10 pt-4 space-y-2">
                                        <div className="flex justify-between text-text-secondary text-sm">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(reservation.base_cost)}</span>
                                        </div>
                                        {reservation.discount > 0 && (
                                            <div className="flex justify-between text-status-success text-sm">
                                                <span>Discount</span>
                                                <span>-{formatCurrency(reservation.discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-text-muted/10">
                                            <span className="text-white font-bold">Total</span>
                                            <span className="text-xl font-bold text-customer-primary">
                                                {formatCurrency(reservation.final_cost || reservation.base_cost)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;