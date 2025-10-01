/**
 * Create Order Modal Component
 * 
 * Full-featured order creation interface with:
 * - Customer selection with search
 * - Product search and selection
 * - Quantity management
 * - Real-time price calculation
 * - Delivery address
 * - Order notes
 * 
 * @module components/orders/CreateOrderModal
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Package,
  MapPin,
  FileText,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCustomerStore } from '@/lib/stores/customerStore';
import { useProductStore } from '@/lib/stores/productStore';
import { odooService } from '@/lib/odoo/odooService';
import { useNotifications } from '@/lib/stores/notificationStore';
import { formatCurrency, cn } from '@/lib/utils';
import { Product, Customer } from '@/types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { customers, fetchCustomers } = useCustomerStore();
  const { products, fetchProducts } = useProductStore();
  const notifications = useNotifications();

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchProducts();
    }
  }, [isOpen, fetchCustomers, fetchProducts]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    const query = customerSearch.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query)
    );
  }, [customers, customerSearch]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.slice(0, 10); // Show first 10 by default
    const query = productSearch.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
    );
  }, [products, productSearch]);

  // Calculate totals
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [orderItems]);

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    // Auto-fill delivery address if available
    if (customer.address && customer.city) {
      setDeliveryAddress(`${customer.address}, ${customer.city}, ${customer.country}`);
    }
  };

  // Handle product selection
  const handleSelectProduct = (product: Product) => {
    // Check if product already in cart
    const existingItem = orderItems.find((item) => item.productId === product.id);

    if (existingItem) {
      // Increase quantity
      handleUpdateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
      };
      setOrderItems([...orderItems, newItem]);
    }

    setProductSearch('');
    setShowProductDropdown(false);
  };

  // Update item quantity
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setOrderItems(
      orderItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: item.unitPrice * newQuantity,
            }
          : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!selectedCustomer) {
      notifications.error('Validation Error', 'Please select a customer');
      return false;
    }

    if (orderItems.length === 0) {
      notifications.error('Validation Error', 'Please add at least one product');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (saveAsDraft: boolean = false) => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerId: selectedCustomer!.id,
        items: orderItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        deliveryAddress: deliveryAddress || undefined,
        notes: notes || undefined,
      };

      // Create order via Odoo service
      await odooService.createOrder(orderData);

      notifications.success(
        'Success',
        saveAsDraft
          ? 'Order saved as draft successfully'
          : 'Order created successfully'
      );

      // Reset form
      handleReset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      notifications.error('Error', 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setProductSearch('');
    setOrderItems([]);
    setDeliveryAddress('');
    setNotes('');
  };

  // Handle close
  const handleClose = () => {
    if (orderItems.length > 0) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        handleReset();
        onClose();
      }
    } else {
      handleReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create New Order</h2>
                  <p className="text-sm text-white/80">Fill in order details below</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Customer Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <User className="w-4 h-4 text-primary-600" />
                  Select Customer *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                    fullWidth
                  />

                  {/* Customer Dropdown */}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-600">
                              {customer.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {customer.email} • {customer.phone}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Customer Display */}
                {selectedCustomer && (
                  <div className="mt-3 p-4 bg-primary-50 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedCustomer.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedCustomer.email} • {selectedCustomer.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearch('');
                      }}
                      className="p-1 hover:bg-primary-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <Package className="w-4 h-4 text-primary-600" />
                  Add Products *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                    fullWidth
                  />

                  {/* Product Dropdown */}
                  {showProductDropdown && filteredProducts.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          disabled={product.stockQuantity === 0}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.sku} • Stock: {product.stockQuantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary-600">
                              {formatCurrency(product.price)}
                            </p>
                            {product.stockQuantity === 0 && (
                              <p className="text-xs text-danger-600">Out of stock</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              {orderItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Order Items ({orderItems.length})
                  </h3>
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-3xl flex-shrink-0 border border-gray-200">
                          {item.productImage}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.unitPrice)} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center px-2 py-1.5 border border-gray-300 rounded font-semibold text-sm"
                            min="1"
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-danger-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {orderItems.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    No products added yet. Search and add products above.
                  </p>
                </div>
              )}

              {/* Delivery Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <FileText className="w-4 h-4 text-primary-600" />
                  Order Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions or notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Order Summary */}
              {orderItems.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (15%):</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(tax)}
                      </span>
                    </div>
                    <div className="h-px bg-gray-300 my-3" />
                    <div className="flex justify-between">
                      <span className="text-base font-bold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || !selectedCustomer || orderItems.length === 0}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmit(false)}
                isLoading={isSubmitting}
                disabled={!selectedCustomer || orderItems.length === 0}
              >
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
