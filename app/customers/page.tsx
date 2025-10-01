/**
 * Customers Page
 * 
 * Complete customer management interface with:
 * - Customer list with search and filters
 * - Customer details modal
 * - Purchase history
 * - Add/Edit customer forms
 * - Customer statistics
 * 
 * @module app/customers/page
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useCustomerStore } from '@/lib/stores';
import { Customer, CustomerStatus } from '@/lib/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function CustomersPage() {
  const { customers } = useCustomerStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form state for add/edit customer
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);
      
      const matchesStatus = 
        selectedStatus === 'all' || customer.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      totalRevenue,
      averageOrderValue: isNaN(averageOrderValue) ? 0 : averageOrderValue,
    };
  }, [customers]);

  // Handlers
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
    });
    setShowAddCustomerModal(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
    });
    setShowAddCustomerModal(true);
  };

  const handleSaveCustomer = () => {
    // TODO: Integrate with Odoo API
    console.log('Saving customer:', customerForm);
    setShowAddCustomerModal(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      // TODO: Integrate with Odoo API
      console.log('Deleting customer:', customerId);
    }
  };

  const getStatusVariant = (status: CustomerStatus): 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'blocked':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const formatStatus = (status: CustomerStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your customer relationships
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleAddCustomer}
          >
            Add Customer
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <Card.Body className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCustomers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-success-600">
                    {stats.activeCustomers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Inactive</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {stats.inactiveCustomers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-warning-600" />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.averageOrderValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <Card.Body className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === 'active' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedStatus('active')}
                >
                  Active
                </Button>
                <Button
                  variant={selectedStatus === 'inactive' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedStatus('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Customers Table */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">
              Customer List ({filteredCustomers.length})
            </h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-600">
                              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Member since {formatDate(customer.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{customer.city}, {customer.country}</span>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm font-semibold text-gray-900">
                          {customer.totalOrders}
                        </p>
                      </td>

                      {/* Total Spent */}
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Badge
                            variant={getStatusVariant(customer.status)}
                            dot
                          >
                            {formatStatus(customer.status)}
                          </Badge>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewCustomer(customer)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Customer"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-4 h-4 text-danger-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  No customers found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCustomerModal(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Customer Details
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      View complete customer information
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCustomerModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary-600">
                        {selectedCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedCustomer.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusVariant(selectedCustomer.status)} dot>
                          {formatStatus(selectedCustomer.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          • Member since {formatDate(selectedCustomer.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCustomer.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Address
                    </h3>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedCustomer.address}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedCustomer.city}, {selectedCustomer.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Purchase Statistics
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-primary-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-600">
                          {selectedCustomer.totalOrders}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Total Orders</p>
                      </div>
                      <div className="p-4 bg-success-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-success-600">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Total Spent</p>
                      </div>
                      <div className="p-4 bg-warning-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-warning-600">
                          {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Avg Order</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Recent Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Last order: {formatDate(selectedCustomer.lastOrderDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCustomerModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setShowCustomerModal(false);
                      handleEditCustomer(selectedCustomer);
                    }}
                  >
                    Edit Customer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Customer Modal */}
      {showAddCustomerModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddCustomerModal(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </h2>
                  <button
                    onClick={() => setShowAddCustomerModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+230 5123 4567"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <Input
                        type="text"
                        placeholder="Port Louis"
                        value={customerForm.city}
                        onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Street address"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <Input
                      type="text"
                      placeholder="Mauritius"
                      value={customerForm.country}
                      onChange={(e) => setCustomerForm({ ...customerForm, country: e.target.value })}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddCustomerModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveCustomer}
                  >
                    {editingCustomer ? 'Save Changes' : 'Add Customer'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
