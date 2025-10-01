/**
 * Card Component
 * 
 * Reusable card component with header, body, and footer sections.
 * Apple-inspired design with subtle shadows and smooth hover effects.
 * 
 * @module components/ui/Card
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card props interface
 */
interface CardProps {
  /** Card children */
  children: React.ReactNode;
  
  /** Enable hover effect */
  hoverable?: boolean;
  
  /** Add padding to card */
  padding?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
}

/**
 * Card Header props
 */
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Body props
 */
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Footer props
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main Card Component
 * 
 * @example
 * <Card hoverable>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Card content goes here</p>
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button>Action</Button>
 *   </Card.Footer>
 * </Card>
 */
export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, hoverable = false, padding = true, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles
        'bg-white rounded-xl shadow-sm',
        'border border-gray-100',
        'transition-all duration-200',
        
        // Padding
        padding && 'overflow-hidden',
        
        // Hover effect
        hoverable && 'hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 cursor-pointer',
        
        // Clickable cursor
        onClick && 'cursor-pointer',
        
        // Custom className
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card Body Component
 */
const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

/**
 * Card Footer Component
 */
const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-100 bg-gray-50',
        className
      )}
    >
      {children}
    </div>
  );
};

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
