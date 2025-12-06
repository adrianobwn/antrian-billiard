import { sequelize } from '../src/config/database.js';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Test database connection
  try {
    await sequelize.authenticate();
    console.log('Test database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to test database:', error);
  }
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

// Clean database before each test
beforeEach(async () => {
  // Optionally clean database tables
  // This ensures tests are isolated
});