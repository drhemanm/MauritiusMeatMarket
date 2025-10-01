/**
 * Reports Page
 * 
 * Comprehensive analytics and reporting dashboard with:
 * - Sales performance metrics
 * - Customer analytics
 * - Product performance
 * - Inventory insights
 * - Interactive charts
 * - Export capabilities
 * 
 * @module app/reports/page
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useNotifications } from '@/lib/stores/notificationStore';

type DateRange = '7days' | '30days' | '90days' | 'year' | 'custom';

const COLORS = ['#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export default function ReportsPage() {
  const notifications = useNotifications();

  // State
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [isLoading] = useState(false);

  // Get mock data (replace with actual data from Odoo later)
  const {
    kpis,
    salesTrend,
    topProducts,
    topCustomers,
    salesByCategory,
    revenueByChannel,
  } = useMemo(() => {
    // Mock KPI data
    const kpis = {
      totalRevenue: 245680,
      revenueGrowth: 12.5,
      totalOrders: 1247,
      ordersGrowth: 8.3,
      averageOrderValue: 197.12,
      avgOrderGrowth: 3.8,
      totalCustomers: 342,
      customersGrowth: 15.2,
    };

    // Mock sales trend (last 30 days)
    const salesTrend = [
      { date: 'Week 1', revenue: 52000, orders: 245 },
      { date: 'Week 2', revenue: 58000, orders: 278 },
      { date: 'Week 3', revenue: 61000, orders: 298 },
      { date: 'Week 4', revenue: 74680, orders: 426 },
    ];

    // Mock top products
    const topProducts = [
      { name: 'Premium Beef Steak', revenue: 45200, units: 856, growth: 15.3 },
      { name: 'Fresh Tuna', revenue: 38500, units: 592, growth: 12.1 },
      { name: 'Chicken Breast', revenue: 32100, units: 1783, growth: 8.7 },
      { name: 'Lamb Leg', revenue: 28900, units: 498, growth: -2.4 },
      { name: 'Prawns', revenue: 24800, units: 344, growth: 22.8 },
    ];

    // Mock top customers
    const topCustomers = [
      { name: 'Le Gourmet Restaurant', revenue: 42500, orders: 28, avgOrder: 1518 },
      { name: 'Paradise Resort', revenue: 38200, orders: 24, avgOrder: 1592 },
      { name: 'SuperMart Ltd', revenue: 35600, orders: 45, avgOrder: 791 },
      { name: 'Ocean View Hotel', revenue: 29800, orders: 18, avgOrder: 1656 },
      { name: 'Fresh Foods Market', revenue: 26400, orders: 32, avgOrder: 825 },
    ];

    // Mock sales by category
    const salesByCategory = [
      { name: 'Fresh Meat', value: 35, amount: 85890 },
      { name: 'Seafood', value: 28, amount: 68720 },
      { name: 'Poultry', value: 22, amount: 54010 },
      { name: 'Processed', value: 15, amount: 36850 },
    ];

    // Mock revenue by channel
    const revenueByChannel = [
      { name: 'Direct Sales', value: 45, amount: 110556 },
      { name: 'Online Orders', value: 35, amount: 85988 },
      { name: 'Wholesale', value: 20, amount: 49136 },
    ];

    return {
      kpis,
      salesTrend,
      topProducts,
      topCustomers,
      salesByCategory,
      revenueByChannel,
    };
  }, [dateRange]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-900">
                {entry.name.includes('Revenue') || entry.name.includes('revenue')
                  ? formatCurrency(entry.value)
                  : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle export
  const handleExport = (type: 'pdf' | 'excel') => {
    notifications.info(
      'Export Started',
      `Exporting reports to ${type.toUpperCase()}...`
    );
    // TODO: Implement actual export functionality
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive business insights and performance metrics
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
          <Button
            variant="secondary"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <Card.Body className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={dateRange === '7days' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setDateRange('7days')}
              >
                Last 7 Days
              </Button>
              <Button
                variant={dateRange === '30days' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setDateRange('30days')}
              >
                Last 30 Days
              </Button>
              <Button
                variant={dateRange === '90days' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setDateRange('90days')}
              >
                Last 90 Days
              </Button>
              <Button
                variant={dateRange === 'year' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setDateRange('year')}
              >
                This Year
              </Button>
              <Button
                variant={dateRange === 'custom' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setDateRange('custom')}
              >
                Custom
              </Button>
            </div>

            {dateRange === 'custom' && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <Badge variant={kpis.revenueGrowth > 0 ? 'success' : 'danger'}>
                {kpis.revenueGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(kpis.revenueGrowth)}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(kpis.totalRevenue)}
            </h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </Card.Body>
        </Card>

        {/* Total Orders */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-success-600" />
              </div>
              <Badge variant={kpis.ordersGrowth > 0 ? 'success' : 'danger'}>
                {kpis.ordersGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(kpis.ordersGrowth)}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(kpis.totalOrders)}
            </h3>
            <p className="text-sm text-gray-600">Total Orders</p>
          </Card.Body>
        </Card>

        {/* Average Order Value */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-warning-600" />
              </div>
              <Badge variant={kpis.avgOrderGrowth > 0 ? 'success' : 'danger'}>
                {kpis.avgOrderGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(kpis.avgOrderGrowth)}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(kpis.averageOrderValue)}
            </h3>
            <p className="text-sm text-gray-600">Avg Order Value</p>
          </Card.Body>
        </Card>

        {/* Total Customers */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
              <Badge variant={kpis.customersGrowth > 0 ? 'success' : 'danger'}>
                {kpis.customersGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(kpis.customersGrowth)}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(kpis.totalCustomers)}
            </h3>
            <p className="text-sm text-gray-600">Active Customers</p>
          </Card.Body>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <p className="text-sm text-gray-500 mt-0.5">Revenue and orders over time</p>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ fill: '#4F46E5', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Orders"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Sales by Category */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
            <p className="text-sm text-gray-500 mt-0.5">Revenue distribution</p>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center justify-between gap-8">
              <ResponsiveContainer width="50%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>

              <div className="flex-1 space-y-3">
                {salesByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Revenue by Channel */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Channel</h3>
            <p className="text-sm text-gray-500 mt-0.5">Sales channel breakdown</p>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByChannel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#4F46E5" radius={[8, 8, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Top Products */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <p className="text-sm text-gray-500 mt-0.5">Best performing products</p>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">{product.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </p>
                    <Badge variant={product.growth > 0 ? 'success' : 'danger'} size="sm">
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <p className="text-sm text-gray-500 mt-0.5">Highest revenue customers</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => notifications.info('Coming Soon', 'Full customer report coming soon!')}
            >
              View Full Report
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Avg Order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(customer.revenue)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary">{customer.orders}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-gray-600">
                        {formatCurrency(customer.avgOrder)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
