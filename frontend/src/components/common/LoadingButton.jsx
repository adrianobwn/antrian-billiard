import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({
    children,
    loading = false,
    disabled = false,
    loadingText = 'Loading...',
    className = '',
    variant = 'primary',
    size = 'medium',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg'
    };

    const variantClasses = {
        primary: 'bg-customer-primary text-white hover:bg-customer-primary-hover focus:ring-customer-primary disabled:opacity-50',
        secondary: 'bg-surface text-text-primary hover:bg-surface-elevated focus:ring-surface disabled:opacity-50',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:opacity-50',
        admin: 'bg-admin-accent text-white hover:bg-orange-600 focus:ring-admin-accent disabled:opacity-50'
    };

    const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSpinner size="small" color="white" className="mr-2" />
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default LoadingButton;