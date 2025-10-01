/**
 * Product Store
 * 
 * Global state management for products using Zustand.
 * Manages product catalog and inventory data.
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
  
  // Actions
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  clearError: () => void;
}

/**
 * Product store
 * Manages product state globally
 */
export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  isLoading: false,
  error: null,

  /**
   * Fetch all products from Odoo
   */
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await odooService.getProducts(1, 1000);
      set({ 
        products: response.data, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false 
      });
    }
  },

  /**
   * Search products by name or SKU
   * 
   * @param query - Search query
   */
  searchProducts: async (query: string) => {
    try {
      const results = await odooService.searchProducts(query);
      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));
