import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TableType = sequelize.define('TableType', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 50]
        }
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(7), // Hex color code
        allowNull: true,
        defaultValue: '#00a859',
        validate: {
            is: /^#[0-9A-F]{6}$/i // Hex color validation
        }
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'table'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'table_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ]
});

// Associations will be defined in models/index.js

export default TableType;
