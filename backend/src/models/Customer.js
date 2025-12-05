import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100],
        },
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[0-9+\-\s()]+$/i,
        },
    },
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (customer) => {
            if (customer.password) {
                const salt = await bcrypt.genSalt(10);
                customer.password = await bcrypt.hash(customer.password, salt);
            }
        },
        beforeUpdate: async (customer) => {
            if (customer.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                customer.password = await bcrypt.hash(customer.password, salt);
            }
        },
    },
});

// Instance method to compare password
Customer.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get safe user data (without password)
Customer.prototype.toSafeObject = function () {
    const { password, ...safeData } = this.toJSON();
    return safeData;
};

export default Customer;
