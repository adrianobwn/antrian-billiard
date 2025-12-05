import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Table = sequelize.define('Table', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    table_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
    table_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'table_types',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
        defaultValue: 'available',
        allowNull: false,
    },
}, {
    tableName: 'tables',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Table;
