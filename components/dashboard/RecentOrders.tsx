/**
 * Recent Orders Component
 * 
 * Displays a list of recent orders with status badges.
 * Quick overview of latest transactions.
 * 
 * @module components/dashboard/RecentOrders
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Recent Orders props
 */
interface RecentOrdersProps {
  /** Array of recent orders */
  orders: Order[];
  
  /** Maximum number of orders to display */
  limit?: number;
}

/**
 * Get badge variant based on order status
 */
const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'received':
      return 'success';
    case 'shipping':
      return 'warning';
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'danger';
    default:
      return 'gray';
  }
};

/**
 * Format status text
 */
const formatStatus = (status: Order['status']): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Recent Orders Component
 */
export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  limit = 5,
}) => {
  const displayOrders = orders.slice(0, limit);

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Latest transactions
            </p>
          </div>
          <Link
            href="/orders"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Product
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Customer
                </th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Price
                </th>
                <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {order.items[0]?.productImage || '📦'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.items[0]?.productName || 'Unknown Product'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.orderNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {formatDate(order.date)}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 truncate max-w-xs">
                      {order.customerName}
                    </p>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Badge
                        variant={getStatusVariant(order.status)}
                        dot
                      >
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {displayOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500">
              Orders will appear here once created
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
