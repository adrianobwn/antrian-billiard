import React from 'react';
import { cn } from '../../utils/helpers';

const Card = ({
  children,
  className = '',
  elevated = false,
  hover = false,
  ...props
}) => {
  const baseClasses = 'rounded-lg border border-text-muted/10 transition-all duration-200';
  const backgroundClasses = elevated ? 'card-elevated' : 'card';
  const hoverClasses = hover ? 'hover:shadow-xl hover:border-text-muted/20' : '';

  const classes = cn(
    baseClasses,
    backgroundClasses,
    hoverClasses,
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-text-muted/10', className)} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-text-muted/10', className)} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;