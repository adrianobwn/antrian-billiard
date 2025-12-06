'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('promos', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            discount_type: {
                type: Sequelize.ENUM('percentage', 'fixed'),
                allowNull: false,
            },
            discount_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            min_hours: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            valid_from: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            valid_until: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            max_uses: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            current_uses: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            }
        });

        // Add indexes
        await queryInterface.addIndex('promos', ['code'], { unique: true });
        await queryInterface.addIndex('promos', ['is_active']);
        await queryInterface.addIndex('promos', ['valid_from', 'valid_until']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('promos');
    }
};