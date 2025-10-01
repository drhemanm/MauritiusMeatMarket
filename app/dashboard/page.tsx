/**
 * Dashboard Page
 * 
 * Main dashboard with KPIs, charts, and recent activity.
 * Displays real-time business metrics and sales analytics.
 * 
 * @module app/dashboard/page
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  Calendar,
} from 'lucide-react';
import {
  KPICard,
  SalesChart,
  SalesDistributionChart,
  RecentOrders,
} from '@/components/dashboard';
import { Card } from '@/components/ui';
import { useAuthStore } from '@/lib/stores';
import {
  generateMockKPIs,
  generateMockSalesData,
  generateMockSalesDistribution,
  generateMockOrders,
  generateMockCustomerAnalytics,
} from '@/lib/mockData';
import { formatCurrency, formatNumber } from '@/lib/utils';

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data (replace with actual API calls)
  const kpis = generateMockKPIs();
  const salesData = generateMockSalesData();
  const salesDistribution = generateMockSalesDistribution();
  const recentOrders = generateMockOrders();
  const customerAnalytics = generateMockCustomerAnalytics();

  /**
   * Simulate data loading
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Get greeting based on time of day
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Orders"
          value="947"
          change="+5%"
          trend="up"
          icon={<ShoppingCart className="w-5 h-5" />}
          isDark
        />
        <KPICard
          title="Total Sales"
          value="$28,407"
          change="+3%"
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <KPICard
          title="Online Sessions"
          value="54,778"
          change="+2%"
          trend="up"
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          title="Avg Order Value"
          value="$28.92"
          change="-1%"
          trend="down"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart data={salesData} height={350} />
        </div>

        {/* Sales Distribution - Takes 1 column */}
        <div className="lg:col-span-1">
          <SalesDistributionChart data={salesDistribution} height={350} />
        </div>
      </div>

      {/* Recent Orders & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} limit={5} />
        </div>

        {/* Quick Stats Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Customer Stats Card */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Stats
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                This month
              </p>
            </Card.Header>
            <Card.Body className="space-y-4">
              {/* Total Customers */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total Customers
                    </p>
                    <p className="text-xs text-gray-500">Active accounts</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">2,543</p>
              </div>

              {/* New Customers */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New This Month
                    </p>
                    <p className="text-xs text-gray-500">+12% from last</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">145</p>
              </div>

              {/* Repeat Customers */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Repeat Rate
                    </p>
                    <p className="text-xs text-gray-500">Returning customers</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">68%</p>
              </div>
            </Card.Body>
          </Card>

          {/* Inventory Alert Card */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Inventory Alert
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Low stock items
              </p>
            </Card.Header>
            <Card.Body className="space-y-3">
              {/* Low Stock Item 1 */}
              <div className="flex items-center gap-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  🥩
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Premium Beef Steak
                  </p>
                  <p className="text-xs text-warning-700 font-medium">
                    Only 15 kg left
                  </p>
                </div>
              </div>

              {/* Low Stock Item 2 */}
              <div className="flex items-center gap-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  🦐
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Tiger Prawns
                  </p>
                  <p className="text-xs text-warning-700 font-medium">
                    Only 8 kg left
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-2 px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm font-medium">
                View Inventory
              </button>
            </Card.Body>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </Card.Header>
            <Card.Body className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Create Order
                  </p>
                  <p className="text-xs text-gray-500">New sale order</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Add Customer
                  </p>
                  <p className="text-xs text-gray-500">New customer</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Check Inventory
                  </p>
                  <p className="text-xs text-gray-500">Product stock</p>
                </div>
              </button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
