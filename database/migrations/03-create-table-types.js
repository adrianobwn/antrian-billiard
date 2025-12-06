'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('table_types', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            hourly_rate: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true,
                defaultValue: '#00a859',
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: 'table',
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

        // Add index
        await queryInterface.addIndex('table_types', ['name'], { unique: true });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('table_types');
    }
};