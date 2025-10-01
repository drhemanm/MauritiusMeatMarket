/**
 * Products Page
 * 
 * Complete product catalog management with:
 * - Grid/List view toggle
 * - Search and filters
 * - Product details modal
 * - Stock status indicators
 * - Category filtering
 * 
 * @module app/products/page
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Eye,
  Edit,
  Package,
  DollarSign,
  TrendingDown,
  AlertCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useProductStore } from '@/lib/stores';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { useNotifications } from '@/lib/stores/notificationStore';

type ViewMode = 'grid' | 'list';
type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

export default function ProductsPage() {
  const { products, fetchProducts, isLoading } = useProductStore();
  const notifications = useNotifications();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category.name);
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || product.category.name === selectedCategory;

      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'in-stock') {
        matchesStock = product.stockQuantity > 10;
      } else if (stockFilter === 'low-stock') {
        matchesStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
      } else if (stockFilter === 'out-of-stock') {
        matchesStock = product.stockQuantity === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(p => p.stockQuantity > 10).length;
    const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
    const outOfStock = products.filter(p => p.stockQuantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
    };
  }, [products]);

  // Get stock status
  const getStockStatus = (quantity: number): { label: string; variant: 'success' | 'warning' | 'danger' } => {
    if (quantity === 0) {
      return { label: 'Out of Stock', variant: 'danger' };
    } else if (quantity <= 10) {
      return { label: 'Low Stock', variant: 'warning' };
    } else {
      return { label: 'In Stock', variant: 'success' };
    }
  };

  // Handlers
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => notifications.info('Coming Soon', 'Add product feature coming soon!')}
        >
          Add Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">In Stock</p>
                <p className="text-2xl font-bold text-success-600">{stats.inStock}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-warning-600">{stats.lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Out of Stock</p>
                <p className="text-2xl font-bold text-danger-600">{stats.outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-danger-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card>
        <Card.Body className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-w-[200px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <div className="flex gap-2">
              <Button
                variant={stockFilter === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setStockFilter('all')}
              >
                All
              </Button>
              <Button
                variant={stockFilter === 'in-stock' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setStockFilter('in-stock')}
              >
                In Stock
              </Button>
              <Button
                variant={stockFilter === 'low-stock' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setStockFilter('low-stock')}
              >
                Low Stock
              </Button>
              <Button
                variant={stockFilter === 'out-of-stock' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setStockFilter('out-of-stock')}
              >
                Out
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                leftIcon={<Grid3x3 className="w-4 h-4" />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
                leftIcon={<List className="w-4 h-4" />}
              >
                List
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Products Display */}
      <div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stockQuantity);
              return (
                <Card key={product.id} hoverable onClick={() => handleViewProduct(product)}>
                  <Card.Body className="p-4">
                    {/* Product Image */}
                    <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-6xl">{product.image}</span>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">{product.sku}</p>
                        </div>
                        <Badge variant={stockStatus.variant} size="sm">
                          {stockStatus.label}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-lg font-bold text-primary-600">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className="text-lg font-bold text-gray-900">
                            {product.stockQuantity}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-gray-500">{product.category.name}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card>
            <Card.Body className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stock
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
                    {filteredProducts.map(product => {
                      const stockStatus = getStockStatus(product.stockQuantity);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          {/* Product */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                {product.image}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {product.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{product.sku}</p>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{product.category.name}</p>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(product.price)}
                            </p>
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4 text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {product.stockQuantity} {product.uom}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <Badge variant={stockStatus.variant} dot>
                                {stockStatus.label}
                              </Badge>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleViewProduct(product)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => notifications.info('Coming Soon', 'Edit product feature coming soon!')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    No products found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Empty State for Grid */}
        {viewMode === 'grid' && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowProductModal(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Product Image & Basic Info */}
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-7xl">{selectedProduct.image}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedProduct.name}
                      </h3>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant={getStockStatus(selectedProduct.stockQuantity).variant} dot>
                          {getStockStatus(selectedProduct.stockQuantity).label}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          SKU: {selectedProduct.sku}
                        </span>
                      </div>
                      {selectedProduct.description && (
                        <p className="text-gray-600">{selectedProduct.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Stock Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Selling Price</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(selectedProduct.price)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Available Stock</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedProduct.stockQuantity} {selectedProduct.uom}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Product Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">{selectedProduct.category.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Unit of Measure</p>
                        <p className="font-medium text-gray-900">{selectedProduct.uom}</p>
                      </div>
                      {selectedProduct.cost && (
                        <div>
                          <p className="text-gray-500">Cost Price</p>
                          <p className="font-medium text-gray-900">{formatCurrency(selectedProduct.cost)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium text-gray-900">
                          {selectedProduct.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => notifications.info('Coming Soon', 'Add to order feature coming soon!')}
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
