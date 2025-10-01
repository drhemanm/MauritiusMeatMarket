/**
 * Authentication Store
 * 
 * Global state management for authentication using Zustand.
 * Manages user session, login/logout, and auth state.
 * 
 * @module lib/stores/authStore
 */

import { create } from 'zustand';
import { User, LoginCredentials } from '@/types';
import { authService } from '@/lib/auth/authService';

/**
 * Authentication state interface
 */
interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

/**
 * Authentication store
 * Manages authentication state globally
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login user with credentials
   * 
   * @param credentials - Login credentials
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even if logout fails
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Check if user is authenticated (on app load)
   */
  checkAuth: () => {
    const isAuth = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    set({
      user,
      isAuthenticated: isAuth,
      isLoading: false,
    });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Update user profile
   * 
   * @param updates - Partial user data to update
   */
  updateUser: async (updates: Partial<User>) => {
    set({ isLoading: true, error: null });

    try {
      const updatedUser = await authService.updateProfile(updates);
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Update failed',
      });
      throw error;
    }
  },
}));
