import React from 'react';
import { cn } from '../../utils/helpers';

const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';

  const variants = {
    default: 'bg-surface-elevated text-text-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    primary: 'bg-customer-primary text-white',
    secondary: 'bg-admin-primary text-white',
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;