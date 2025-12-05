import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Promo = sequelize.define('Promo', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isUppercase: true,
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    min_hours: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    valid_from: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    valid_until: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    max_uses: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_uses: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'promos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Instance method to check if promo is valid
Promo.prototype.isValid = function (hours = 0) {
    const now = new Date();
    const validFrom = new Date(this.valid_from);
    const validUntil = new Date(this.valid_until);

    return (
        this.is_active &&
        now >= validFrom &&
        now <= validUntil &&
        hours >= this.min_hours &&
        (this.max_uses === null || this.current_uses < this.max_uses)
    );
};

export default Promo;
