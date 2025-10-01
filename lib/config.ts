/**
 * Application Configuration
 * 
 * Centralizes all configuration values and environment variables.
 * Provides type-safe access to configuration with fallback values.
 * 
 * @module lib/config
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Mauritius Meat Market',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  description: 'Salesman Portal for Odoo 18 Integration',
} as const;

/**
 * Odoo API Configuration
 * These values will be replaced with actual Odoo credentials
 */
export const ODOO_CONFIG = {
  url: process.env.NEXT_PUBLIC_ODOO_URL || 'https://demo.odoo.com',
  database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'demo',
  apiKey: process.env.ODOO_API_KEY || '',
  
  // Odoo API endpoints
  endpoints: {
    authenticate: '/web/session/authenticate',
    call: '/web/dataset/call_kw',
    search: '/web/dataset/search_read',
  },
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'default-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Token storage key in localStorage
  tokenKey: 'mmm_auth_token',
  userKey: 'mmm_user_data',
  
  // Session timeout (7 days in milliseconds)
  sessionTimeout: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  
  // API rate limiting
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
} as const;

/**
 * Offline Sync Configuration
 */
export const SYNC_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  
  // Sync interval in milliseconds (5 minutes default)
  interval: parseInt(process.env.NEXT_PUBLIC_SYNC_INTERVAL || '300000'),
  
  // Maximum retry attempts for failed syncs
  maxRetryAttempts: parseInt(process.env.NEXT_PUBLIC_MAX_RETRY_ATTEMPTS || '3'),
  
  // IndexedDB configuration
  dbName: 'mmm_offline_db',
  dbVersion: 1,
  
  // Store names in IndexedDB
  stores: {
    orders: 'orders',
    customers: 'customers',
    products: 'products',
    queue: 'sync_queue',
  },
} as const;

/**
 * Feature Flags
 * Enable/disable features without code changes
 */
export const FEATURES = {
  offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const;

/**
 * UI Configuration following Apple design philosophy
 */
export const UI_CONFIG = {
  // Primary brand color (Apple-style blue)
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    info: '#5AC8FA',
  },
  
  // Animation durations (in milliseconds)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Border radius values
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xl: '20px',
  },
  
  // Shadow definitions
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    large: '0 8px 24px rgba(0, 0, 0, 0.16)',
  },
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

/**
 * Date Format Configuration
 */
export const DATE_CONFIG = {
  displayFormat: 'MMM dd, yyyy',
  apiFormat: 'yyyy-MM-dd',
  timeFormat: 'HH:mm:ss',
  dateTimeFormat: 'MMM dd, yyyy HH:mm',
} as const;

/**
 * Chart Configuration for analytics
 */
export const CHART_CONFIG = {
  colors: {
    primary: '#4F46E5',
    secondary: '#F59E0B',
    tertiary: '#10B981',
    quaternary: '#EF4444',
  },
  
  // Chart height in pixels
  height: {
    small: 200,
    medium: 300,
    large: 400,
  },
} as const;

/**
 * Notification Configuration
 */
export const NOTIFICATION_CONFIG = {
  position: 'top-right' as const,
  duration: 5000, // 5 seconds
  maxNotifications: 5,
} as const;

/**
 * Security Configuration
 */
export const SECURITY_CONFIG = {
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  
  // CORS settings
  cors: {
    allowedOrigins: ['http://localhost:3000'],
  },
  
  // Content Security Policy
  csp: {
    enabled: true,
  },
} as const;

/**
 * Validation helper to check if all required environment variables are set
 */
export function validateConfig(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_APP_NAME',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get configuration value safely with fallback
 */
export function getConfig<T>(key: string, fallback: T): T {
  const value = process.env[key];
  return value ? (value as unknown as T) : fallback;
}
