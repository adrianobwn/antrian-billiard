'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tables', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            table_number: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true,
            },
            table_type_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'table_types',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            status: {
                type: Sequelize.ENUM('available', 'occupied', 'maintenance'),
                defaultValue: 'available',
                allowNull: false,
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
        await queryInterface.addIndex('tables', ['table_number'], { unique: true });
        await queryInterface.addIndex('tables', ['table_type_id']);
        await queryInterface.addIndex('tables', ['status']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tables');
    }
};