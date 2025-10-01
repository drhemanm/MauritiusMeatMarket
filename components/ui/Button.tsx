/**
 * Button Component
 * 
 * Reusable button component with multiple variants and sizes.
 * Follows Apple design philosophy with smooth interactions.
 * 
 * @module components/ui/Button
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button variants
 */
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';

/**
 * Button sizes
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button props interface
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant;
  
  /** Button size */
  size?: ButtonSize;
  
  /** Show loading state */
  isLoading?: boolean;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Button children */
  children?: React.ReactNode;
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 shadow-sm hover:shadow',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400',
  success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus:ring-success-500 shadow-sm hover:shadow',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 focus:ring-danger-500 shadow-sm hover:shadow',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400',
  outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Button Component
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * @example
 * <Button variant="secondary" leftIcon={<Icon />} isLoading>
 *   Loading...
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variant styles
          variantStyles[variant],
          
          // Size styles
          sizeStyles[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Custom className
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <span className="spinner" />
        )}
        
        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="inline-flex items-center">{leftIcon}</span>
        )}
        
        {/* Button text */}
        {children}
        
        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="inline-flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
