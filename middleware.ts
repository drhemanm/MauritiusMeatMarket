/**
 * Next.js Middleware
 * 
 * Handles authentication protection for routes.
 * Redirects unauthenticated users to login page.
 * 
 * @module middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected routes that require authentication
 */
const protectedRoutes = [
  '/dashboard',
  '/orders',
  '/customers',
  '/products',
  '/reports',
  '/settings',
];

/**
 * Public routes that don't require authentication
 */
const publicRoutes = ['/login'];

/**
 * Middleware function
 * Checks authentication status and redirects accordingly
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // TEMPORARILY DISABLED: Allow access to all routes for testing
  // Get auth token from localStorage (checked client-side)
  // For now, we'll let the client-side auth handle redirects
  
  // Redirect root to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specifies which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
