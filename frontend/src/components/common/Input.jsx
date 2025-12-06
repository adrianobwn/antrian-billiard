import React from 'react';
import { cn } from '../../utils/helpers';

const Input = ({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}) => {
  const inputClasses = cn(
    'input',
    error && 'border-status-error focus:border-status-error focus:ring-status-error',
    className
  );

  return (
    <div className={cn('mb-4', containerClassName)}>
      {label && (
        <label className={cn(
          'block text-sm font-medium text-text-secondary mb-2',
          labelClassName
        )}>
          {label}
          {props.required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-status-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default Input;