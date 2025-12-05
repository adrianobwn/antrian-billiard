import bcrypt from 'bcrypt';
import { sequelize, Customer, Admin, TableType, Table, Promo, Reservation, Payment } from './src/models/index.js';
import logger from './src/utils/logger.js';

/**
 * Database seeder script
 * Populates database with sample data
 */
const seed = async () => {
    try {
        logger.info('🌱 Starting database seeding...');

        // Check connection
        await sequelize.authenticate();

        // Clear existing data (optional)
        if (process.argv.includes('--fresh')) {
            logger.info('🗑️  Clearing existing data...');
            await Payment.destroy({ where: {}, force: true });
            await Reservation.destroy({ where: {}, force: true });
            await Table.destroy({ where: {}, force: true });
            await TableType.destroy({ where: {}, force: true });
            await Promo.destroy({ where: {}, force: true });
            await Customer.destroy({ where: {}, force: true });
            await Admin.destroy({ where: {}, force: true });
        }

        // 1. Create Admins
        logger.info('👤 Creating admin accounts...');
        const admins = await Admin.bulkCreate([
            {
                name: 'Super Admin',
                email: 'admin@antrianbilliard.com',
                password: 'admin123',
                role: 'super_admin',
            },
            {
                name: 'Manager',
                email: 'manager@antrianbilliard.com',
                password: 'manager123',
                role: 'admin',
            },
            {
                name: 'Staff Member',
                email: 'staff@antrianbilliard.com',
                password: 'staff123',
                role: 'staff',
            },
        ], { individualHooks: true });
        logger.info(`✅ Created ${admins.length} admin accounts`);

        // 2. Create Customers
        logger.info('👥 Creating customer accounts...');
        const customers = await Customer.bulkCreate([
            {
                name: 'Budi Santoso',
                email: 'budi.santoso@email.com',
                password: 'password',
                phone: '081234567890',
            },
            {
                name: 'Siti Nurhaliza',
                email: 'siti.nurhaliza@email.com',
                password: 'password',
                phone: '081298765432',
            },
            {
                name: 'Ahmad Dahlan',
                email: 'ahmad.dahlan@email.com',
                password: 'password',
                phone: '081211223344',
            },
        ], { individualHooks: true });
        logger.info(`✅ Created ${customers.length} customer accounts`);

        // 3. Create Table Types
        logger.info('🎱 Creating table types...');
        const tableTypes = await TableType.bulkCreate([
            {
                name: 'Standard',
                hourly_rate: 50000,
                description: 'Standard billiard table with basic equipment',
            },
            {
                name: 'VIP',
                hourly_rate: 75000,
                description: 'VIP table with premium cues and comfortable seating',
            },
            {
                name: 'VVIP',
                hourly_rate: 100000,
                description: 'Exclusive VVIP table in private room with premium amenities',
            },
        ]);
        logger.info(`✅ Created ${tableTypes.length} table types`);

        // 4. Create Tables
        logger.info('📋 Creating billiard tables...');
        const tables = [];
        for (let i = 1; i <= 12; i++) {
            let typeIndex = i <= 6 ? 0 : (i <= 10 ? 1 : 2);
            tables.push({
                table_number: `T${i.toString().padStart(2, '0')}`,
                table_type_id: tableTypes[typeIndex].id,
                status: i <= 8 ? 'available' : (i <= 10 ? 'occupied' : 'maintenance'),
            });
        }
        const createdTables = await Table.bulkCreate(tables);
        logger.info(`✅ Created ${createdTables.length} tables`);

        // 5. Create Promos
        logger.info('🎟️  Creating promotional codes...');
        const promos = await Promo.bulkCreate([
            {
                code: 'WELCOME2025',
                description: 'Welcome bonus for new customers',
                discount_type: 'percentage',
                discount_value: 20,
                min_hours: 2,
                valid_from: '2025-01-01',
                valid_until: '2025-12-31',
                max_uses: 100,
                current_uses: 15,
                is_active: true,
            },
            {
                code: 'WEEKEND50',
                description: 'Weekend special discount',
                discount_type: 'fixed',
                discount_value: 50000,
                min_hours: 3,
                valid_from: '2025-01-01',
                valid_until: '2025-12-31',
                max_uses: null,
                current_uses: 42,
                is_active: true,
            },
            {
                code: 'VIP15',
                description: '15% off for VIP tables',
                discount_type: 'percentage',
                discount_value: 15,
                min_hours: 1,
                valid_from: '2025-01-01',
                valid_until: '2025-06-30',
                max_uses: 50,
                current_uses: 8,
                is_active: true,
            },
        ]);
        logger.info(`✅ Created ${promos.length} promo codes`);

        // 6. Create Sample Reservations
        logger.info('📅 Creating sample reservations...');
        const now = new Date();
        const reservations = await Reservation.bulkCreate([
            {
                customer_id: customers[0].id,
                table_id: createdTables[0].id,
                promo_id: promos[0].id,
                start_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                end_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
                duration_hours: 2,
                base_cost: 100000,
                discount: 20000,
                final_cost: 80000,
                status: 'completed',
                notes: 'Great experience!',
            },
            {
                customer_id: customers[1].id,
                table_id: createdTables[7].id,
                promo_id: null,
                start_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                end_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
                duration_hours: 3,
                base_cost: 225000,
                discount: 0,
                final_cost: 225000,
                status: 'completed',
                notes: '',
            },
            {
                customer_id: customers[0].id,
                table_id: createdTables[2].id,
                promo_id: null,
                start_time: new Date(now.getTime() + 2 * 60 * 60 * 1000),
                end_time: new Date(now.getTime() + 5 * 60 * 60 * 1000),
                duration_hours: 3,
                base_cost: 150000,
                discount: 0,
                final_cost: 150000,
                status: 'confirmed',
                notes: '',
            },
        ]);
        logger.info(`✅ Created ${reservations.length} sample reservations`);

        // 7. Create Payments for completed reservations
        logger.info('💳 Creating sample payments...');
        const payments = await Payment.bulkCreate([
            {
                reservation_id: reservations[0].id,
                amount: 80000,
                payment_method: 'cash',
                payment_status: 'paid',
                paid_at: reservations[0].end_time,
            },
            {
                reservation_id: reservations[1].id,
                amount: 225000,
                payment_method: 'card',
                payment_status: 'paid',
                paid_at: reservations[1].end_time,
            },
            {
                reservation_id: reservations[2].id,
                amount: 150000,
                payment_method: 'e-wallet',
                payment_status: 'pending',
                paid_at: null,
            },
        ]);
        logger.info(`✅ Created ${payments.length} payment records`);

        logger.info('');
        logger.info('🎉 Database seeding completed successfully!');
        logger.info('');
        logger.info('📝 Test Accounts:');
        logger.info('   Admin: admin@antrianbilliard.com / admin123');
        logger.info('   Customer: budi.santoso@email.com / password');
        logger.info('');

        process.exit(0);
    } catch (error) {
        logger.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
