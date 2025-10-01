/**
 * Orders Page
 * 
 * Complete orders management with filtering, search, and CRUD operations.
 * 
 * @module app/orders/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { Button, Badge, Card, Input } from '@/components/ui';
import { CreateOrderModal } from '@/components/orders/CreateOrderModal';
import { odooService } from '@/lib/odoo/odooService';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useNotifications } from '@/lib/stores/notificationStore';

/**
 * Orders Page Component
 */
export default function OrdersPage() {
  const notifications = useNotifications();
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /**
   * Fetch orders on mount
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Apply filters when search or status changes
   */
  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, orders]);

  /**
   * Fetch orders from API
   */
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await odooService.getOrders(undefined, 1, 100);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      notifications.error('Error', 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Apply search and status filters
   */
  const applyFilters = () => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  /**
   * Get badge variant for order status
   */
  const getStatusVariant = (status: OrderStatus) => {
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
  const formatStatus = (status: OrderStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  /**
   * Handle view order details
   */
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  /**
   * Handle delete order
   */
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await odooService.cancelOrder(orderId);
      notifications.success('Success', 'Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      notifications.error('Error', 'Failed to cancel order');
    }
  };

  /**
   * Handle create order success
   */
  const handleCreateSuccess = () => {
    fetchOrders();
  };

  /**
   * Export orders to CSV
   */
  const handleExport = () => {
    notifications.info('Export', 'Exporting orders...');
    // TODO: Implement CSV export
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            New Order
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by order number, customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                fullWidth
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shipping">Shipping</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <Button
                variant="secondary"
                leftIcon={<Filter className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters (collapsible) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="date"
                label="From Date"
                fullWidth
              />
              <Input
                type="date"
                label="To Date"
                fullWidth
              />
              <div className="flex items-end gap-2">
                <Button variant="secondary" fullWidth>
                  Apply Filters
                </Button>
                <Button variant="ghost">
                  Clear
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-primary-900 mt-1">
                  {orders.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-warning-900 mt-1">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-success-900 mt-1">
                  {orders.filter(o => o.status === 'received').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Amount
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-3xl">📋</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          No orders found
                        </h3>
                        <p className="text-sm text-gray-500">
                          {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Create your first order to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Order */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                            {order.items[0]?.productImage || '📦'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {order.customerName}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {formatDate(order.date)}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Badge variant={getStatusVariant(order.status)} dot>
                            {formatStatus(order.status)}
                          </Badge>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => notifications.info('Coming Soon', 'Edit order feature coming soon!')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit order"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                            title="Cancel order"
                          >
                            <Trash2 className="w-4 h-4 text-danger-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setShowOrderModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Order Details
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {selectedOrder.orderNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="text-2xl text-gray-400">×</span>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Customer</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(selectedOrder.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <Badge variant={getStatusVariant(selectedOrder.status)} dot>
                        {formatStatus(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Salesperson</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedOrder.salespersonName}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {item.productImage}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedOrder.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (15%)</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedOrder.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-primary-600">
                        {formatCurrency(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {selectedOrder.deliveryAddress && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Delivery Address
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Close
                  </Button>
                  <Button variant="primary">
                    Print Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
