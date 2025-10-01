/**
 * Customer Store
 * 
 * Global state management for customers using Zustand.
 * Manages customer data, fetching, and caching.
 * 
 * @module lib/stores/customerStore
 */

import { create } from 'zustand';
import { Customer } from '@/types';
import { odooService } from '@/lib/odoo/odooService';

/**
 * Customer state interface
 */
interface CustomerState {
  // State
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Actions
  fetchCustomers: (force?: boolean) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  clearCustomers: () => void;
}

/**
 * Customer store
 * Manages customer data globally with caching
 */
export const useCustomerStore = create<CustomerState>((set, get) => ({
  // Initial state
  customers: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  /**
   * Fetch customers from Odoo
   * Includes caching to avoid unnecessary API calls
   * 
   * @param force - Force refresh even if cached
   */
  fetchCustomers: async (force = false) => {
    const { lastFetched, isLoading } = get();

    // Don't fetch if already loading
    if (isLoading) return;

    // Use cache if available and less than 5 minutes old
    if (!force && lastFetched) {
      const cacheAge = Date.now() - lastFetched.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      if (cacheAge < fiveMinutes) {
        console.log('Using cached customers');
        return;
      }
    }

    set({ isLoading: true, error: null });

    try {
      const response = await odooService.getCustomers(undefined, 1, 200);
      set({
        customers: response.data,
        isLoading: false,
        error: null,
        lastFetched: new Date(),
      });
      console.log(`Fetched ${response.data.length} customers`);
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch customers',
        isLoading: false,
      });
    }
  },

  /**
   * Get customer by ID
   * 
   * @param id - Customer ID
   * @returns Customer or undefined
   */
  getCustomerById: (id: string) => {
    return get().customers.find((c) => c.id === id);
  },

  /**
   * Add customer to store
   * Used after creating a new customer
   * 
   * @param customer - Customer to add
   */
  addCustomer: (customer: Customer) => {
    set((state) => ({
      customers: [...state.customers, customer],
    }));
  },

  /**
   * Update customer in store
   * 
   * @param id - Customer ID
   * @param updates - Fields to update
   */
  updateCustomer: (id: string, updates: Partial<Customer>) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  /**
   * Clear all customers
   * Used on logout
   */
  clearCustomers: () => {
    set({
      customers: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  },
}));
