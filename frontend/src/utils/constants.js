// Table statuses
export const TABLE_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    MAINTENANCE: 'maintenance',
};

// Reservation statuses
export const RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
};

// Payment methods
export const PAYMENT_METHOD = {
    CASH: 'cash',
    CARD: 'card',
    E_WALLET: 'e-wallet',
};

// Admin roles
export const ADMIN_ROLE = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    STAFF: 'staff',
};

// User types
export const USER_TYPE = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
};

// Status colors for badges
export const STATUS_COLORS = {
    [RESERVATION_STATUS.PENDING]: 'warning',
    [RESERVATION_STATUS.CONFIRMED]: 'info',
    [RESERVATION_STATUS.COMPLETED]: 'success',
    [RESERVATION_STATUS.CANCELLED]: 'error',
    [TABLE_STATUS.AVAILABLE]: 'success',
    [TABLE_STATUS.OCCUPIED]: 'error',
    [TABLE_STATUS.MAINTENANCE]: 'warning',
    [PAYMENT_STATUS.PENDING]: 'warning',
    [PAYMENT_STATUS.PAID]: 'success',
    [PAYMENT_STATUS.REFUNDED]: 'error',
};

export default {
    TABLE_STATUS,
    RESERVATION_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHOD,
    ADMIN_ROLE,
    USER_TYPE,
    STATUS_COLORS,
};
