import express from 'express';
import {
    getAllReservations,
    getReservationById,
    checkAvailability,
    createReservation,
    updateReservation,
    cancelReservation,
    processPayment,
    createReservationValidation,
    checkAvailabilityValidation,
    updateReservationValidation,
    processPaymentValidation,
} from '../controllers/reservationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * All reservation routes require authentication
 */
router.use(authenticate);

/**
 * Reservation Routes
 */

// Get all reservations (filtered by user type)
router.get('/', getAllReservations);

// Check availability
router.post('/check-availability', checkAvailabilityValidation, validate, checkAvailability);

// Create reservation
router.post('/', createReservationValidation, validate, createReservation);

// Get reservation by ID
router.get('/:id', getReservationById);

// Update reservation
router.put('/:id', updateReservationValidation, validate, updateReservation);

// Cancel reservation
router.delete('/:id', cancelReservation);

// Process payment
router.post('/:id/payment', processPaymentValidation, validate, processPayment);

export default router;
