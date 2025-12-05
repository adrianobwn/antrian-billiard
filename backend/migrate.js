import { sequelize, Customer, Admin, TableType, Table, Promo, Reservation, Payment, ActivityLog } from './src/models/index.js';
import logger from './src/utils/logger.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbName = process.env.DB_NAME || 'antrian_billiard_v2';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';

const ensureDatabaseExists = async () => {
    const conn = await mysql.createConnection({ host: dbHost, port: dbPort, user: dbUser, password: dbPassword });
    try {
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        logger.info(`✅ Ensured database exists: ${dbName}`);
    } finally {
        await conn.end();
    }
};

/**
 * Database migration script
 * Creates all tables based on Sequelize models
 */
const migrate = async () => {
    try {
        logger.info('🔄 Starting database migration...');

        // Ensure database exists
        await ensureDatabaseExists();

        // Test connection
        await sequelize.authenticate();
        logger.info('✅ Database connection successful');

        // Sync all models (create tables)
        // force: true will drop existing tables
        // alter: true will alter tables to match models
        await sequelize.sync({ force: process.argv.includes('--force'), alter: process.argv.includes('--alter') });

        logger.info('✅ Database tables created successfully!');
        logger.info('📊 Tables created:');
        logger.info('   - customers');
        logger.info('   - admins');
        logger.info('   - table_types');
        logger.info('   - tables');
        logger.info('   - promos');
        logger.info('   - reservations');
        logger.info('   - payments');
        logger.info('   - activity_logs');

        process.exit(0);
    } catch (error) {
        logger.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
