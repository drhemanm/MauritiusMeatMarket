/**
 * Notification Store
 * 
 * Global state management for notifications using Zustand.
 * Manages toast notifications and alerts throughout the app.
 * 
 * @module lib/stores/notificationStore
 */

import { create } from 'zustand';
import { Notification, NotificationType } from '@/types';
import { generateId } from '@/lib/utils';
import { NOTIFICATION_CONFIG } from '@/lib/config';

/**
 * Notification state interface
 */
interface NotificationState {
  // State
  notifications: Notification[];

  // Actions
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

/**
 * Notification store
 * Manages notifications globally
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],

  /**
   * Add new notification
   * Automatically removes after duration
   * 
   * @param type - Notification type
   * @param title - Notification title
   * @param message - Notification message
   * @param actionUrl - Optional action URL
   */
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    const id = generateId();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl,
    };

    set((state) => {
      // Limit number of notifications
      const notifications = [...state.notifications, notification];
      if (notifications.length > NOTIFICATION_CONFIG.maxNotifications) {
        notifications.shift(); // Remove oldest
      }
      return { notifications };
    });

    // Auto-remove after duration
    setTimeout(() => {
      get().removeNotification(id);
    }, NOTIFICATION_CONFIG.duration);
  },

  /**
   * Remove notification by ID
   * 
   * @param id - Notification ID
   */
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  /**
   * Mark notification as read
   * 
   * @param id - Notification ID
   */
  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    set({ notifications: [] });
  },
}));

/**
 * Helper hook for common notification actions
 */
export const useNotifications = () => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  return {
    success: (title: string, message: string, actionUrl?: string) =>
      addNotification('success', title, message, actionUrl),
    
    error: (title: string, message: string, actionUrl?: string) =>
      addNotification('error', title, message, actionUrl),
    
    warning: (title: string, message: string, actionUrl?: string) =>
      addNotification('warning', title, message, actionUrl),
    
    info: (title: string, message: string, actionUrl?: string) =>
      addNotification('info', title, message, actionUrl),
  };
};
