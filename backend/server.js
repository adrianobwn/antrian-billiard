import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import config from './src/config/server.js';
import sequelize, { testConnection } from './src/config/database.js';
import logger from './src/utils/logger.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Billiard Reservation System API is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes will be added here
// Import and use routes
import apiRoutes from './src/routes/index.js';
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
let server;

const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Sync database (in development)
        if (config.env === 'development') {
            await sequelize.sync({ alter: true });
            logger.info('Database synced successfully');
        }

        // Start listening
        server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📍 Environment: ${config.env}`);
            logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
        });
        server.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is in use`);
            }
            process.exit(1);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    if (server) {
        server.close(() => process.exit(0));
    } else {
        process.exit(0);
    }
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    if (server) {
        server.close(() => process.exit(0));
    } else {
        process.exit(0);
    }
});

startServer();

export default app;
