/**
 * Dashboard Layout
 * 
 * Layout wrapper for dashboard and all protected pages.
 * Includes sidebar, header, and authentication check.
 * 
 * @module app/dashboard/layout
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useAuthStore } from '@/lib/stores';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    checkAuth();
    setIsChecking(false);
  }, [checkAuth]);

  /**
   * Redirect if not authenticated
   */
  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push('/login');
    }
  }, [isChecking, isAuthenticated, router]);

  // Show loading while checking auth
  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
