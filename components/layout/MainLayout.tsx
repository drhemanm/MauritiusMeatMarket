/**
 * Main Layout Component
 * 
 * Root layout wrapper that includes sidebar, header, and main content area.
 * Handles responsive behavior and layout state.
 * 
 * @module components/layout/MainLayout
 */

'use client';

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/lib/stores/uiStore';
import { useSyncStore } from '@/lib/stores/syncStore';
import { cn } from '@/lib/utils';

/**
 * Main Layout props
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main Layout Component
 * 
 * @example
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isSidebarOpen, isSidebarCollapsed, setSidebarOpen, setIsMobile, isMobile } = useUIStore();
  const { initialize: initializeSync } = useSyncStore();

  /**
   * Handle window resize for responsive behavior
   */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile, setSidebarOpen]);

  /**
   * Initialize sync service
   */
  useEffect(() => {
    initializeSync();
  }, [initializeSync]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 lg:p-6 safe-bottom">
          {children}
        </main>
      </div>
    </div>
  );
};
