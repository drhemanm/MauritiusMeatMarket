/**
 * TypeScript Type Definitions for Mauritius Meat Market Salesman Portal
 * 
 * This file contains all shared TypeScript interfaces and types used throughout
 * the application. Centralizing types ensures consistency and type safety.
 * 
 * @module types
 * @author drhemanm
 * @license MIT
 */

// ==================== USER & AUTHENTICATION ====================

/**
 * User roles in the system
 * - admin: Full access to all features including user management
 * - salesman: Standard salesperson with access to sales features
 */
export type UserRole = 'admin' | 'salesman';

/**
 * User authentication and profile information
 * Represents a logged-in user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  odooPartnerId?: number;
  lastLogin?: Date;
}

/**
 * Authentication credentials for Odoo login
 */
export interface LoginCredentials {
  username: string;
  password: string;
  database?: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: number;
}

// ==================== ORDERS ====================

/**
 * Order status matching the design you provided
 */
export type OrderStatus = 'shipping' | 'received' | 'pending' | 'cancelled';

/**
 * Order line item (product in an order)
 */
export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax?: number;
  discount?: number;
}

/**
 * Complete order information
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  items: OrderLine[];
  subtotal: number;
  tax: number;
  total: number;
  salespersonId: string;
  salespersonName?: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus?: 'synced' | 'pending' | 'failed';
}

/**
 * Form data for creating a new order
 */
export interface CreateOrderData {
  customerId: string;
  items: Omit<OrderLine, 'id' | 'subtotal'>[];
  deliveryAddress?: string;
  notes?: string;
}

// ==================== CUSTOMERS ====================

/**
 * Customer status
 */
export type CustomerStatus = 'active' | 'inactive';

/**
 * Customer information from Odoo
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  billingAddress?: string;
  shippingAddress?: string;
  company?: string;
  taxId?: string;
  notes?: string;
  odooPartnerId?: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== PRODUCTS ====================

/**
 * Product category
 */
export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
}

/**
 * Product information from Odoo inventory
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: ProductCategory;
  price: number;
  cost?: number;
  stockQuantity: number;
  image: string;
  isActive: boolean;
  uom: string;
  odooProductId?: number;
}

// ==================== ANALYTICS & KPIs ====================

/**
 * Key Performance Indicator data for dashboard
 */
export interface KPI {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
}

/**
 * Monthly sales data for charts
 */
export interface SalesData {
  month: string;
  onlineSales: number;
  offlineSales: number;
  returns?: number;
}

/**
 * Sales distribution data for pie chart
 */
export interface SalesDistribution {
  name: string;
  value: number;
  color: string;
}

/**
 * Customer analytics data
 */
export interface CustomerAnalytics {
  month: string;
  loyalCustomers: number;
  newCustomers: number;
}

// ==================== NOTIFICATIONS ====================

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Real-time notification
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// ==================== OFFLINE SYNC ====================

/**
 * Offline queue item for syncing with Odoo when back online
 */
export interface OfflineQueueItem {
  id: string;
  type: 'order' | 'customer' | 'product';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

/**
 * Sync status for offline mode
 */
export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingItems: number;
  isSyncing: boolean;
}

// ==================== API RESPONSES ====================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== FILTERS & SEARCH ====================

/**
 * Filter options for orders
 */
export interface OrderFilters {
  status?: OrderStatus[];
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

/**
 * Filter options for customers
 */
export interface CustomerFilters {
  status?: CustomerStatus[];
  searchQuery?: string;
  minOrders?: number;
  minSpent?: number;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
