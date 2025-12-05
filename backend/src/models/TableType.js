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
        },
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'table_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default TableType;
