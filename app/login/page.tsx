/**
 * Login Page
 * 
 * Authentication page for Odoo credentials.
 * Clean, modern design following Apple's aesthetic.
 * 
 * @module app/login/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { DEV_CREDENTIALS } from '@/lib/auth/authService';

/**
 * Login Page Component
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, error, clearError, isLoading } = useAuthStore();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /**
   * Redirect if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  /**
   * Clear error when user types
   */
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [username, password]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    try {
      await login({ username, password });
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
      console.error('Login failed:', err);
    }
  };

  /**
   * Quick login with dev credentials (for development only)
   */
  const handleQuickLogin = async (role: 'admin' | 'salesman') => {
    const credentials = role === 'admin' ? DEV_CREDENTIALS.admin : DEV_CREDENTIALS.salesman;
    setUsername(credentials.username);
    setPassword(credentials.password);

    try {
      await login(credentials);
      router.push('/dashboard');
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🥩</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to Mauritius Meat Market
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3 animate-slide-in-down">
              <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-danger-900 mb-1">
                  Login Failed
                </h3>
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Input */}
            <Input
              type="text"
              label="Email or Username"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              fullWidth
              autoComplete="username"
              autoFocus
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                fullWidth
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!username || !password || isLoading}
              isLoading={isLoading}
              className="mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Development Mode
              </span>
            </div>
          </div>

          {/* Quick Login Buttons (Dev Only) */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => handleQuickLogin('admin')}
              disabled={isLoading}
            >
              🔑 Quick Login as Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => handleQuickLogin('salesman')}
              disabled={isLoading}
            >
              👤 Quick Login as Salesman
            </Button>
          </div>

          {/* Dev Credentials Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Development Credentials:
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Admin:</span>{' '}
                {DEV_CREDENTIALS.admin.username} / {DEV_CREDENTIALS.admin.password}
              </div>
              <div>
                <span className="font-medium">Salesman:</span>{' '}
                {DEV_CREDENTIALS.salesman.username} / {DEV_CREDENTIALS.salesman.password}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble logging in?{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Contact Support
            </button>
          </p>
        </div>

        {/* Version Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Version 1.0.0 • Powered by Odoo 18
          </p>
        </div>
      </div>
    </div>
  );
}
