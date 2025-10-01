/**
 * Customer Store
 * 
 * Global state management for customers using Zustand.
 * Manages customer data, CRUD operations, and state.
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
  
  // Actions
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Customer store
 * Manages customer state globally
 */
export const useCustomerStore = create<CustomerState>((set, get) => ({
  // Initial state
  customers: [],
  isLoading: false,
  error: null,

  /**
   * Fetch all customers from Odoo
   */
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await odooService.getCustomers(undefined, 1, 1000);
      set({ 
        customers: response.data, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch customers',
        isLoading: false 
      });
    }
  },

  /**
   * Add new customer
   * 
   * @param customerData - Partial customer data
   */
  addCustomer: async (customerData: Partial<Customer>) => {
    set({ isLoading: true, error: null });
    
    try {
      const newCustomer = await odooService.createCustomer(customerData);
      set((state) => ({
        customers: [...state.customers, newCustomer],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error adding customer:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add customer',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Update existing customer
   * 
   * @param id - Customer ID
   * @param updates - Partial customer data to update
   */
  updateCustomer: async (id: string, updates: Partial<Customer>) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedCustomer = await odooService.updateCustomer(id, updates);
      set((state) => ({
        customers: state.customers.map((c) => 
          c.id === id ? updatedCustomer : c
        ),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error updating customer:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update customer',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Delete customer (marks as inactive in Odoo)
   * 
   * @param id - Customer ID
   */
  deleteCustomer: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mark as inactive instead of hard delete
      await odooService.updateCustomer(id, { status: 'inactive' });
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error deleting customer:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete customer',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));
