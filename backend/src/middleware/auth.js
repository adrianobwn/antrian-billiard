import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/auth.js';

/**
 * Middleware to verify JWT token
 */
export const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: { message: 'No token provided. Authorization required.' },
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            type: decoded.type, // 'customer' or 'admin'
            role: decoded.role, // for admins only
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: { message: 'Token expired. Please login again.' },
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid token.' },
            });
        }

        return res.status(500).json({
            success: false,
            error: { message: 'Authentication failed.' },
        });
    }
};

export default authenticate;
