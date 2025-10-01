/**
 * UI Store
 * 
 * Global state management for UI-related state using Zustand.
 * Manages sidebar, modals, loading states, etc.
 * 
 * @module lib/stores/uiStore
 */

import { create } from 'zustand';

/**
 * UI state interface
 */
interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Modal state
  activeModal: string | null;
  modalData: any;

  // Loading state
  isGlobalLoading: boolean;
  loadingMessage: string;

  // Mobile detection
  isMobile: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setIsMobile: (isMobile: boolean) => void;
}

/**
 * UI store
 * Manages UI state globally
 */
export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  isGlobalLoading: false,
  loadingMessage: '',
  isMobile: false,

  /**
   * Toggle sidebar open/closed
   */
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  /**
   * Set sidebar open state
   * 
   * @param open - Open state
   */
  setSidebarOpen: (open: boolean) => {
    set({ isSidebarOpen: open });
  },

  /**
   * Toggle sidebar collapsed/expanded
   */
  toggleSidebarCollapse: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },

  /**
   * Open modal
   * 
   * @param modalId - Modal identifier
   * @param data - Optional data to pass to modal
   */
  openModal: (modalId: string, data?: any) => {
    set({ activeModal: modalId, modalData: data });
  },

  /**
   * Close active modal
   */
  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  /**
   * Set global loading state
   * Used for full-page loading indicators
   * 
   * @param loading - Loading state
   * @param message - Optional loading message
   */
  setGlobalLoading: (loading: boolean, message: string = '') => {
    set({ isGlobalLoading: loading, loadingMessage: message });
  },

  /**
   * Set mobile detection state
   * 
   * @param isMobile - Is mobile device
   */
  setIsMobile: (isMobile: boolean) => {
    set({ isMobile });
  },
}));
