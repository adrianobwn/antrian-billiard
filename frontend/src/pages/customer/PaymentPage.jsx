import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import reservationService from '../../services/reservationService';
import paymentService from '../../services/paymentService';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import {
    CreditCard,
    DollarSign,
    Smartphone,
    CheckCircle,
    ArrowLeft,
    AlertCircle,
    Clock,
    Calendar
} from 'lucide-react';

const paymentSchema = z.object({
    paymentMethod: z.enum(['cash', 'card', 'ewallet'], {
        required_error: 'Please select a payment method'
    }),
    cardNumber: z.string().optional(),
    cardHolder: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    ewalletProvider: z.string().optional(),
    ewalletPhone: z.string().optional(),
}).refine((data) => {
    if (data.paymentMethod === 'card') {
        return data.cardNumber && data.cardHolder && data.expiryDate && data.cvv;
    }
    if (data.paymentMethod === 'ewallet') {
        return data.ewalletProvider && data.ewalletPhone;
    }
    return true;
}, {
    message: 'Please fill in all required fields for the selected payment method',
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

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentMethod: 'cash'
        }
    });

    const selectedPaymentMethod = watch('paymentMethod');

    useEffect(() => {
        if (!reservationId) {
            navigate('/customer/reservations');
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
            let paymentData = {
                payment_method: data.paymentMethod,
                amount: reservation.final_cost || reservation.base_cost
            };

            // Add payment method specific details
            if (data.paymentMethod === 'card') {
                paymentData.payment_details = {
                    card_number: data.cardNumber.replace(/\s/g, ''),
                    card_holder: data.cardHolder,
                    expiry_date: data.expiryDate,
                    type: 'credit_card'
                };
            } else if (data.paymentMethod === 'ewallet') {
                paymentData.payment_details = {
                    provider: data.ewalletProvider,
                    phone: data.ewalletPhone,
                    type: 'ewallet'
                };
            } else {
                paymentData.payment_details = {
                    type: 'cash'
                };
            }

            // For demo purposes, we'll use the simulate payment method
            const response = await paymentService.simulatePayment(reservationId, data.paymentMethod);

            if (response.success) {
                setSuccess(true);
                // Update reservation status
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customer-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-status-error mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-white mb-2">Reservation Not Found</h2>
                    <p className="text-text-secondary mb-4">The reservation you're trying to pay for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/customer/reservations')}
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-8">
                    <div className="text-center">
                        <CheckCircle className="mx-auto text-status-success mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-text-secondary mb-6">
                            Your reservation has been confirmed and payment processed successfully.
                        </p>

                        <div className="card p-4 mb-6 text-left">
                            <h3 className="font-semibold text-white mb-2">Reservation Details</h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-text-secondary">
                                    ID: <span className="text-white">#{reservation.id}</span>
                                </p>
                                <p className="text-text-secondary">
                                    Table: <span className="text-white">{reservation.table?.table_number}</span>
                                </p>
                                <p className="text-text-secondary">
                                    Date: <span className="text-white">{formatDateTime(reservation.start_time)}</span>
                                </p>
                                <p className="text-text-secondary">
                                    Amount: <span className="text-customer-primary font-semibold">
                                        {formatCurrency(reservation.final_cost || reservation.base_cost)}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/customer/dashboard')}
                                className="btn btn-primary-customer w-full"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/customer/reservations')}
                                className="btn btn-secondary w-full"
                            >
                                View All Reservations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-white">Complete Your Payment</h1>
                </div>

                {error && (
                    <div className="bg-status-error/10 border border-status-error text-status-error p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div className="card p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Select Payment Method</h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('paymentMethod')}
                                            value="cash"
                                            className="sr-only peer"
                                        />
                                        <div className="p-4 border-2 rounded-lg text-center transition-all peer-checked:border-customer-primary peer-checked:bg-customer-primary/10 border-text-muted/20 hover:border-customer-primary/50">
                                            <DollarSign className="mx-auto mb-2 text-customer-primary" size={32} />
                                            <p className="font-medium text-white">Cash</p>
                                            <p className="text-xs text-text-muted mt-1">Pay at venue</p>
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('paymentMethod')}
                                            value="card"
                                            className="sr-only peer"
                                        />
                                        <div className="p-4 border-2 rounded-lg text-center transition-all peer-checked:border-customer-primary peer-checked:bg-customer-primary/10 border-text-muted/20 hover:border-customer-primary/50">
                                            <CreditCard className="mx-auto mb-2 text-customer-primary" size={32} />
                                            <p className="font-medium text-white">Card</p>
                                            <p className="text-xs text-text-muted mt-1">Credit/Debit</p>
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('paymentMethod')}
                                            value="ewallet"
                                            className="sr-only peer"
                                        />
                                        <div className="p-4 border-2 rounded-lg text-center transition-all peer-checked:border-customer-primary peer-checked:bg-customer-primary/10 border-text-muted/20 hover:border-customer-primary/50">
                                            <Smartphone className="mx-auto mb-2 text-customer-primary" size={32} />
                                            <p className="font-medium text-white">E-Wallet</p>
                                            <p className="text-xs text-text-muted mt-1">Digital payment</p>
                                        </div>
                                    </label>
                                </div>
                                {errors.paymentMethod && (
                                    <p className="text-status-error text-sm mt-2">{errors.paymentMethod.message}</p>
                                )}
                            </div>

                            {/* Payment Details */}
                            {selectedPaymentMethod === 'card' && (
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                {...register('cardNumber')}
                                                placeholder="1234 5678 9012 3456"
                                                className="input text-white"
                                                maxLength={19}
                                            />
                                            {errors.cardNumber && (
                                                <p className="text-status-error text-sm mt-1">{errors.cardNumber.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                {...register('cardHolder')}
                                                placeholder="John Doe"
                                                className="input text-white"
                                            />
                                            {errors.cardHolder && (
                                                <p className="text-status-error text-sm mt-1">{errors.cardHolder.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    {...register('expiryDate')}
                                                    placeholder="MM/YY"
                                                    className="input text-white"
                                                    maxLength={5}
                                                />
                                                {errors.expiryDate && (
                                                    <p className="text-status-error text-sm mt-1">{errors.expiryDate.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    {...register('cvv')}
                                                    placeholder="123"
                                                    className="input text-white"
                                                    maxLength={3}
                                                />
                                                {errors.cvv && (
                                                    <p className="text-status-error text-sm mt-1">{errors.cvv.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedPaymentMethod === 'ewallet' && (
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">E-Wallet Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Provider</label>
                                            <select {...register('ewalletProvider')} className="input text-white">
                                                <option value="">Select provider</option>
                                                <option value="gopay">GoPay</option>
                                                <option value="ovo">OVO</option>
                                                <option value="dana">DANA</option>
                                                <option value="shopeepay">ShopeePay</option>
                                                <option value="linkaja">LinkAja</option>
                                            </select>
                                            {errors.ewalletProvider && (
                                                <p className="text-status-error text-sm mt-1">{errors.ewalletProvider.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                {...register('ewalletPhone')}
                                                placeholder="08123456789"
                                                className="input text-white"
                                            />
                                            {errors.ewalletPhone && (
                                                <p className="text-status-error text-sm mt-1">{errors.ewalletPhone.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary-customer w-full py-4 text-lg font-semibold"
                            >
                                {processing ? 'Processing...' : `Pay ${formatCurrency(reservation.final_cost || reservation.base_cost)}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="pb-4 border-b border-text-muted/20">
                                    <div className="flex items-center gap-2 text-customer-primary mb-2">
                                        🎱 Table {reservation.table?.table_number}
                                    </div>
                                    <p className="text-sm text-text-secondary">{reservation.table?.tableType?.name}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Calendar size={16} />
                                        <span>{formatDateTime(reservation.start_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Clock size={16} />
                                        <span>{reservation.duration_hours || 1} hour{(reservation.duration_hours || 1) > 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-text-muted/20 space-y-2">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(reservation.base_cost)}</span>
                                    </div>
                                    {reservation.discount_amount > 0 && (
                                        <div className="flex justify-between text-status-success">
                                            <span>Discount</span>
                                            <span>-{formatCurrency(reservation.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-text-muted/20">
                                        <span>Total</span>
                                        <span className="text-customer-primary">
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
    );
};

export default PaymentPage;