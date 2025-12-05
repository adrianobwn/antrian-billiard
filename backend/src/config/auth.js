import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-fallback-secret-key-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

export default jwtConfig;
