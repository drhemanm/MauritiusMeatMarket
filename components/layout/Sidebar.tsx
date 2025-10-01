/**
 * Sidebar Component
 * 
 * Main navigation sidebar with collapsible menu items.
 * Apple-inspired clean design with smooth animations.
 * 
 * @module components/layout/Sidebar
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores';
import { useUIStore } from '@/lib/stores/uiStore';

/**
 * Navigation item interface
 */
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
}

/**
 * Navigation items configuration
 */
const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    badge: '8',
  },
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    icon: <Package className="w-5 h-5" />,
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/customers',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    adminOnly: true,
  },
];

/**
 * Sidebar Component
 */
export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebarCollapse, isMobile, setSidebarOpen } = useUIStore();

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Handle navigation item click on mobile
   */
  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  /**
   * Check if nav item is active
   */
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  /**
   * Filter nav items based on user role
   */
  const filteredNavItems = navigationItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <aside
      className={cn(
        // Base styles
        'fixed left-0 top-0 z-40 h-screen',
        'bg-white border-r border-gray-200',
        'transition-all duration-300 ease-in-out',
        'flex flex-col',
        
        // Width based on collapsed state
        isSidebarCollapsed ? 'w-20' : 'w-64',
        
        // Mobile styles
        'lg:translate-x-0'
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          'flex items-center justify-between',
          'h-16 px-4 border-b border-gray-200',
          'bg-gradient-to-r from-primary-600 to-secondary-600'
        )}
      >
        {/* Logo and Title */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-white"
          onClick={handleNavClick}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🥩</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight">Mauritius</span>
              <span className="font-semibold text-xs leading-tight opacity-90">
                Meat Market
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleSidebarCollapse}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* User Info */}
      <div
        className={cn(
          'px-4 py-4 border-b border-gray-200',
          isSidebarCollapsed && 'px-2'
        )}
      >
        <div className={cn('flex items-center gap-3', isSidebarCollapsed && 'justify-center')}>
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>

          {/* User details */}
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                  Admin
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    // Base styles
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'text-sm font-medium transition-all duration-200',
                    'group relative',
                    
                    // Active state
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100',
                    
                    // Collapsed state
                    isSidebarCollapsed && 'justify-center'
                  )}
                >
                  {/* Icon */}
                  <span
                    className={cn(
                      'flex-shrink-0 transition-colors',
                      active ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-danger-100 text-danger-700 text-xs font-semibold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isSidebarCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                      {item.badge && ` (${item.badge})`}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        {/* Support */}
        <button
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
            'text-sm font-medium text-gray-700',
            'hover:bg-gray-100 transition-colors',
            'group relative',
            isSidebarCollapsed && 'justify-center'
          )}
        >
          <HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {!isSidebarCollapsed && <span>Support</span>}
          
          {isSidebarCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Support
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
            'text-sm font-medium text-danger-600',
            'hover:bg-danger-50 transition-colors',
            'group relative',
            isSidebarCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isSidebarCollapsed && <span>Logout</span>}
          
          {isSidebarCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
