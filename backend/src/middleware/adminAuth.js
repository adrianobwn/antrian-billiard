/**
 * Middleware to verify admin role
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.type !== 'admin') {
        return res.status(403).json({
            success: false,
            error: { message: 'Access denied. Admin privileges required.' },
        });
    }
    next();
};

/**
 * Middleware to verify super admin role
 */
export const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.type !== 'admin' || req.user.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            error: { message: 'Access denied. Super admin privileges required.' },
        });
    }
    next();
};

export default { requireAdmin, requireSuperAdmin };
