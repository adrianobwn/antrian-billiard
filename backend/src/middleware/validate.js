import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errors.array().map(err => ({
                    field: err.path || err.param,
                    message: err.msg,
                })),
            },
        });
    }

    next();
};

export default validate;
