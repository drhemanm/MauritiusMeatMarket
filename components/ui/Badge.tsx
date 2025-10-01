/**
 * Badge Component
 * 
 * Small status indicators and labels.
 * Used for order statuses, notifications, etc.
 * 
 * @module components/ui/Badge
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge variants
 */
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';

/**
 * Badge sizes
 */
type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge props interface
 */
interface BadgeProps {
  /** Badge text */
  children: React.ReactNode;
  
  /** Badge variant */
  variant?: BadgeVariant;
  
  /** Badge size */
  size?: BadgeSize;
  
  /** Show dot indicator */
  dot?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  gray: 'bg-gray-100 text-gray-700',
};

/**
 * Dot variant styles mapping
 */
const dotVariantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  gray: 'bg-gray-400',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

/**
 * Badge Component
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  dot = false,
  className,
}) => {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center gap-1.5',
        'rounded-full font-medium',
        'transition-colors duration-200',
        
        // Variant styles
        variantStyles[variant],
        
        // Size styles
        sizeStyles[size],
        
        // Custom className
        className
      )}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotVariantStyles[variant]
          )}
        />
      )}
      
      {children}
    </span>
  );
};
