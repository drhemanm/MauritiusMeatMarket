/**
 * Product Store
 * 
 * Global state management for products using Zustand.
 * Manages product data, fetching, and caching.
 * 
 * @module lib/stores/productStore
 */

import { create } from 'zustand';
import { Product } from '@/types';
import { odooService } from '@/lib/odoo/odooService';

/**
 * Product state interface
 */
interface ProductState {
  // State
  products: Product[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Actions
  fetchProducts: (force?: boolean) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
  updateProductStock: (id: string, newStock: number) => void;
  clearProducts: () => void;
}

/**
 * Product store
 * Manages product data globally with caching
 */
export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  /**
   * Fetch products from Odoo
   * Includes caching to avoid unnecessary API calls
   * 
   * @param force - Force refresh even if cached
   */
  fetchProducts: async (force = false) => {
    const { lastFetched, isLoading } = get();

    // Don't fetch if already loading
    if (isLoading) return;

    // Use cache if available and less than 10 minutes old
    if (!force && lastFetched) {
      const cacheAge = Date.now() - lastFetched.getTime();
      const tenMinutes = 10 * 60 * 1000;
      if (cacheAge < tenMinutes) {
        console.log('Using cached products');
        return;
      }
    }

    set({ isLoading: true, error: null });

    try {
      const response = await odooService.getProducts(1, 200);
      set({
        products: response.data,
        isLoading: false,
        error: null,
        lastFetched: new Date(),
      });
      console.log(`Fetched ${response.data.length} products`);
    } catch (error) {
      console.error('Error fetching products:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  /**
   * Get product by ID
   * 
   * @param id - Product ID
   * @returns Product or undefined
   */
  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },

  /**
   * Search products by name or SKU
   * 
   * @param query - Search query
   * @returns Matching products
   */
  searchProducts: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get products by category
   * 
   * @param categoryId - Category ID
   * @returns Products in category
   */
  getProductsByCategory: (categoryId: string) => {
    return get().products.filter((p) => p.category.id === categoryId);
  },

  /**
   * Update product stock
   * Used after order creation
   * 
   * @param id - Product ID
   * @param newStock - New stock quantity
   */
  updateProductStock: (id: string, newStock: number) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, stockQuantity: newStock } : p
      ),
    }));
  },

  /**
   * Clear all products
   * Used on logout
   */
  clearProducts: () => {
    set({
      products: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  },
}));
