/**
 * KPI Card Component
 * 
 * Displays key performance indicators with trend indicators.
 * Clean, modern design with smooth animations.
 * 
 * @module components/dashboard/KPICard
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * KPI Card props interface
 */
interface KPICardProps {
  /** Card title */
  title: string;
  
  /** Main value to display */
  value: string | number;
  
  /** Change percentage */
  change: string;
  
  /** Trend direction */
  trend: 'up' | 'down' | 'neutral';
  
  /** Icon component */
  icon?: React.ReactNode;
  
  /** Optional subtitle */
  subtitle?: string;
  
  /** Enable dark theme for this card */
  isDark?: boolean;
}

/**
 * KPI Card Component
 * 
 * @example
 * <KPICard
 *   title="Total Sales"
 *   value="$28,407"
 *   change="+3%"
 *   trend="up"
 *   icon={<DollarSign />}
 * />
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  subtitle,
  isDark = false,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        isDark && 'bg-gradient-to-br from-primary-600 to-primary-800 border-primary-700'
      )}
    >
      <Card.Body className="relative">
        {/* Background decoration */}
        <div
          className={cn(
            'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10',
            isDark ? 'bg-white' : 'bg-primary-500'
          )}
        />

        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p
                className={cn(
                  'text-sm font-medium mb-1',
                  isDark ? 'text-primary-100' : 'text-gray-600'
                )}
              >
                {title}
              </p>
              {subtitle && (
                <p
                  className={cn(
                    'text-xs',
                    isDark ? 'text-primary-200' : 'text-gray-500'
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Icon */}
            {icon && (
              <div
                className={cn(
                  'p-2.5 rounded-lg',
                  isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-primary-50 text-primary-600'
                )}
              >
                {icon}
              </div>
            )}
          </div>

          {/* Value */}
          <div className="flex items-end justify-between">
            <h3
              className={cn(
                'text-3xl font-bold',
                isDark ? 'text-white' : 'text-gray-900'
              )}
            >
              {value}
            </h3>

            {/* Trend Indicator */}
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                trend === 'up' &&
                  (isDark
                    ? 'bg-success-500/20 text-success-100'
                    : 'bg-success-100 text-success-700'),
                trend === 'down' &&
                  (isDark
                    ? 'bg-danger-500/20 text-danger-100'
                    : 'bg-danger-100 text-danger-700'),
                trend === 'neutral' &&
                  (isDark
                    ? 'bg-gray-500/20 text-gray-100'
                    : 'bg-gray-100 text-gray-700')
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
