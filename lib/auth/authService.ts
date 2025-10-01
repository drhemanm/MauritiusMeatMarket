/**
 * Authentication Service
 * 
 * Handles user authentication, token management, and session handling.
 * Integrates with Odoo authentication system (placeholder for now).
 * 
 * @module lib/auth/authService
 */

import { User, LoginCredentials, AuthResponse } from '@/types';
import { AUTH_CONFIG } from '@/lib/config';
import { getFromStorage, setToStorage, removeFromStorage } from '@/lib/utils';
import { generateMockUsers, simulateApiDelay } from '@/lib/mockData';

/**
 * Authentication Service Class
 * Singleton pattern for managing authentication state
 */
class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;

  private constructor() {
    // Private constructor for singleton
    this.loadFromStorage();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Load authentication data from localStorage
   * Restores session on page reload
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const token = getFromStorage<string | null>(AUTH_CONFIG.tokenKey, null);
      const user = getFromStorage<User | null>(AUTH_CONFIG.userKey, null);

      if (token && user) {
        // Verify token is not expired
        const payload = this.decodeToken(token);
        if (payload && payload.exp * 1000 > Date.now()) {
          this.authToken = token;
          this.currentUser = user;
        } else {
          // Token expired, clear storage
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
      this.clearStorage();
    }
  }

  /**
   * Save authentication data to localStorage
   */
  private saveToStorage(token: string, user: User): void {
    setToStorage(AUTH_CONFIG.tokenKey, token);
    setToStorage(AUTH_CONFIG.userKey, user);
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearStorage(): void {
    removeFromStorage(AUTH_CONFIG.tokenKey);
    removeFromStorage(AUTH_CONFIG.userKey);
    this.authToken = null;
    this.currentUser = null;
  }

  /**
   * Login with Odoo credentials
   * Currently using mock authentication - will be replaced with actual Odoo API
   * 
   * @param credentials - Login credentials
   * @returns Authentication response with token and user data
   * @throws Error if authentication fails
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await simulateApiDelay(1000);

      // TODO: Replace with actual Odoo authentication
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });

      // Mock authentication logic
      const mockUsers = generateMockUsers();
      const user = mockUsers.find(u => u.email === credentials.username);

      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Mock password validation (in production, this is done server-side)
      // For demo: password is "password123" for all users
      if (credentials.password !== 'password123') {
        throw new Error('Invalid username or password');
      }

      // Generate mock JWT token
      const token = this.generateMockToken(user);
      const expiresAt = Date.now() + AUTH_CONFIG.sessionTimeout;

      // Update user's last login
      user.lastLogin = new Date();

      // Save to memory and storage
      this.authToken = token;
      this.currentUser = user;
      this.saveToStorage(token, user);

      return {
        token,
        user,
        expiresAt,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   * Clears all authentication data and session
   */
  public async logout(): Promise<void> {
    try {
      // TODO: Call Odoo logout endpoint if needed
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.authToken}`,
      //   },
      // });

      // Simulate API delay
      await simulateApiDelay(300);

      // Clear authentication data
      this.clearStorage();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear storage even if API call fails
      this.clearStorage();
    }
  }

  /**
   * Get current authenticated user
   * 
   * @returns Current user or null if not authenticated
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current authentication token
   * 
   * @returns Auth token or null if not authenticated
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Check if user is authenticated
   * 
   * @returns True if user is logged in with valid token
   */
  public isAuthenticated(): boolean {
    if (!this.authToken || !this.currentUser) {
      return false;
    }

    // Verify token is not expired
    const payload = this.decodeToken(this.authToken);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      this.clearStorage();
      return false;
    }

    return true;
  }

  /**
   * Check if current user has admin role
   * 
   * @returns True if user is admin
   */
  public isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  /**
   * Refresh authentication token
   * Extends the session without requiring re-login
   * 
   * @returns New authentication response
   */
  public async refreshToken(): Promise<AuthResponse> {
    try {
      if (!this.authToken || !this.currentUser) {
        throw new Error('No active session to refresh');
      }

      // TODO: Implement actual token refresh with Odoo
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.authToken}`,
      //   },
      // });

      // Simulate API delay
      await simulateApiDelay(500);

      // Generate new token
      const token = this.generateMockToken(this.currentUser);
      const expiresAt = Date.now() + AUTH_CONFIG.sessionTimeout;

      // Update stored token
      this.authToken = token;
      this.saveToStorage(token, this.currentUser);

      return {
        token,
        user: this.currentUser,
        expiresAt,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Update current user profile
   * 
   * @param updates - Partial user data to update
   * @returns Updated user
   */
  public async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user');
      }

      // TODO: Call Odoo API to update user profile
      // const response = await fetch('/api/auth/profile', {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${this.authToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updates),
      // });

      // Simulate API delay
      await simulateApiDelay(500);

      // Update user data
      const updatedUser = { ...this.currentUser, ...updates };
      this.currentUser = updatedUser;
      
      // Update storage
      if (this.authToken) {
        this.saveToStorage(this.authToken, updatedUser);
      }

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Generate mock JWT token for development
   * In production, tokens are generated server-side
   * 
   * @param user - User to generate token for
   * @returns JWT token string
   */
  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + AUTH_CONFIG.sessionTimeout) / 1000),
      })
    );
    const signature = btoa('mock-signature-' + user.id);

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Decode JWT token to extract payload
   * 
   * @param token - JWT token to decode
   * @returns Decoded payload or null if invalid
   */
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Validate password strength
   * Used for password change functionality
   * 
   * @param password - Password to validate
   * @returns Validation result with errors
   */
  public validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const { password: config } = AUTH_CONFIG;

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Change user password
   * 
   * @param currentPassword - Current password for verification
   * @param newPassword - New password
   * @returns Success status
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      // Validate new password
      const validation = this.validatePassword(newPassword);
      if (!validation.valid) {
        return {
          success: false,
          message: validation.errors.join(', '),
        };
      }

      // TODO: Implement actual password change with Odoo
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.authToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });

      // Simulate API delay
      await simulateApiDelay(800);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export default credentials for development/testing
export const DEV_CREDENTIALS = {
  admin: {
    username: 'jean.michel@mmm.mu',
    password: 'password123',
  },
  salesman: {
    username: 'marie.lafitte@mmm.mu',
    password: 'password123',
  },
};
