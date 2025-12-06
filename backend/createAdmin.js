import { Admin } from './src/models/index.js';
import logger from './src/utils/logger.js';

const createAdmin = async () => {
    try {
        // Create admin account
        const admin = await Admin.create({
            name: 'Admin',
            email: 'admin@antrianbilliard.com',
            password: 'admin123',
            role: 'super_admin',
        });

        logger.info(`✅ Admin created: ${admin.email}`);
        logger.info(`Login with email: ${admin.email} and password: admin123`);

        process.exit(0);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            logger.info('✅ Admin account already exists');
        } else {
            logger.error('❌ Error creating admin:', error);
        }
        process.exit(1);
    }
};

createAdmin();