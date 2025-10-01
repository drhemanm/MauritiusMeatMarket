/**
 * Header Component
 * 
 * Top navigation bar with search, notifications, and user menu.
 * Responsive design for mobile and desktop.
 * 
 * @module components/layout/Header
 */

'use client';

import React, { useState } from 'react';
import { Search, Bell, Menu, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/uiStore';
import { useSyncStore } from '@/lib/stores/syncStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { Badge } from '@/components/ui';

/**
 * Header Component
 */
export const Header: React.FC = () => {
  const { toggleSidebar, isMobile } = useUIStore();
  const { isOnline, isSyncing, pendingItems, triggerSync } = useSyncStore();
  const notifications = useNotificationStore((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-top">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Sync Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-success-600" />
                <span className="hidden sm:inline text-xs font-medium text-gray-700">
                  Online
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-danger-600" />
                <span className="hidden sm:inline text-xs font-medium text-gray-700">
                  Offline
                </span>
              </>
            )}
            
            {pendingItems > 0 && (
              <Badge variant="warning" size="sm">
                {pendingItems}
              </Badge>
            )}
          </div>

          {/* Manual Sync Button */}
          <button
            onClick={triggerSync}
            disabled={!isOnline || isSyncing}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isOnline && !isSyncing
                ? 'hover:bg-gray-100 text-gray-700'
                : 'text-gray-400 cursor-not-allowed'
            )}
            title="Sync now"
          >
            <RefreshCw
              className={cn('w-5 h-5', isSyncing && 'animate-spin')}
            />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-in-down">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {notifications.slice(0, 5).map((notification) => (
                          <li
                            key={notification.id}
                            className={cn(
                              'p-4 hover:bg-gray-50 transition-colors cursor-pointer',
                              !notification.read && 'bg-primary-50/50'
                            )}
                          >
                            <div className="flex gap-3">
                              <div
                                className={cn(
                                  'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                                  notification.type === 'success' && 'bg-success-500',
                                  notification.type === 'error' && 'bg-danger-500',
                                  notification.type === 'warning' && 'bg-warning-500',
                                  notification.type === 'info' && 'bg-primary-500'
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
