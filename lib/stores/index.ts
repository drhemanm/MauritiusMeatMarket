/**
 * Store Exports
 * 
 * Central export point for all Zustand stores.
 * Import stores from here for consistency.
 * 
 * @module lib/stores
 */

export { useAuthStore } from './authStore';
export { useSyncStore } from './syncStore';
export { useNotificationStore, useNotifications } from './notificationStore';
export { useUIStore } from './uiStore';
export { useCustomerStore } from './customerStore';
export { useProductStore } from './productStore'; // ADD THIS LINE
