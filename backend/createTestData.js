import { TableType, Table, Promo } from './src/models/index.js';
import logger from './src/utils/logger.js';

const createTestData = async () => {
    try {
        // Create Table Types
        logger.info('🏓 Creating table types...');
        const tableTypes = await TableType.bulkCreate([
            {
                name: 'Standard',
                hourly_rate: 25000,
                description: 'Standard billiard table',
            },
            {
                name: 'VIP',
                hourly_rate: 50000,
                description: 'VIP billiard table with premium features',
            },
            {
                name: 'VVIP',
                hourly_rate: 100000,
                description: 'VVIP billiard table with lounge access',
            },
        ]);
        logger.info(`✅ Created ${tableTypes.length} table types`);

        // Create Tables
        logger.info('🎱 Creating tables...');
        const tables = [];
        const standardTables = await TableType.findOne({ where: { name: 'Standard' } });
        const vipTables = await TableType.findOne({ where: { name: 'VIP' } });
        const vvipTables = await TableType.findOne({ where: { name: 'VVIP' } });

        // Create 6 standard tables
        for (let i = 1; i <= 6; i++) {
            tables.push({
                table_number: `S${i}`,
                table_type_id: standardTables.id,
                status: 'available',
            });
        }

        // Create 3 VIP tables
        for (let i = 1; i <= 3; i++) {
            tables.push({
                table_number: `V${i}`,
                table_type_id: vipTables.id,
                status: 'available',
            });
        }

        // Create 1 VVIP table
        tables.push({
            table_number: 'VV1',
            table_type_id: vvipTables.id,
            status: 'available',
        });

        await Table.bulkCreate(tables);
        logger.info(`✅ Created ${tables.length} tables`);

        // Create Promos
        logger.info('🎟️ Creating promotions...');
        const promos = await Promo.bulkCreate([
            {
                code: 'WELCOME10',
                description: 'Welcome discount for new customers',
                discount_type: 'percentage',
                discount_value: 10,
                min_hours: 2,
                valid_from: new Date(),
                valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                max_uses: 100,
            },
            {
                code: 'WEEKEND20',
                description: 'Weekend special discount',
                discount_type: 'percentage',
                discount_value: 20,
                min_hours: 3,
                valid_from: new Date(),
                valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
                max_uses: 50,
            },
            {
                code: 'FIXED25K',
                description: 'Fixed discount of Rp 25.000',
                discount_type: 'fixed',
                discount_value: 25000,
                min_hours: 1,
                valid_from: new Date(),
                valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
                max_uses: 75,
            },
        ]);
        logger.info(`✅ Created ${promos.length} promotions`);

        logger.info('\n🎉 Test data created successfully!');
        logger.info('\n👤 Admin login:');
        logger.info('   Email: admin@antrianbilliard.com');
        logger.info('   Password: admin123');
        logger.info('\n👤 Customer login:');
        logger.info('   Email: test@example.com');
        logger.info('   Password: password123');

        process.exit(0);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            logger.info('✅ Test data already exists');
        } else {
            logger.error('❌ Error creating test data:', error);
        }
        process.exit(1);
    }
};

createTestData();