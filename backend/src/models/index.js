import sequelize from '../config/database.js';

// Import all models
import Customer from './Customer.js';
import Admin from './Admin.js';
import TableType from './TableType.js';
import Table from './Table.js';
import Promo from './Promo.js';
import Reservation from './Reservation.js';
import Payment from './Payment.js';
import ActivityLog from './ActivityLog.js';

// Define associations

// Table belongs to TableType
Table.belongsTo(TableType, {
    foreignKey: 'table_type_id',
    as: 'tableType',
});

TableType.hasMany(Table, {
    foreignKey: 'table_type_id',
    as: 'tables',
});

// Reservation belongs to Customer, Table, and Promo
Reservation.belongsTo(Customer, {
    foreignKey: 'customer_id',
    as: 'customer',
});

Customer.hasMany(Reservation, {
    foreignKey: 'customer_id',
    as: 'reservations',
});

Reservation.belongsTo(Table, {
    foreignKey: 'table_id',
    as: 'table',
});

Table.hasMany(Reservation, {
    foreignKey: 'table_id',
    as: 'reservations',
});

Reservation.belongsTo(Promo, {
    foreignKey: 'promo_id',
    as: 'promo',
});

Promo.hasMany(Reservation, {
    foreignKey: 'promo_id',
    as: 'reservations',
});

// Payment belongs to Reservation
Payment.belongsTo(Reservation, {
    foreignKey: 'reservation_id',
    as: 'reservation',
});

Reservation.hasOne(Payment, {
    foreignKey: 'reservation_id',
    as: 'payment',
});

// ActivityLog belongs to Customer
ActivityLog.belongsTo(Customer, {
    foreignKey: 'customer_id',
    as: 'customer',
});

Customer.hasMany(ActivityLog, {
    foreignKey: 'customer_id',
    as: 'activityLogs',
});

// Export all models
export {
    sequelize,
    Customer,
    Admin,
    TableType,
    Table,
    Promo,
    Reservation,
    Payment,
    ActivityLog,
};

// Export default object with all models
export default {
    sequelize,
    Customer,
    Admin,
    TableType,
    Table,
    Promo,
    Reservation,
    Payment,
    ActivityLog,
};
