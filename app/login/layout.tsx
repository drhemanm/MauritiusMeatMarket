/**
 * Login Layout
 * 
 * Minimal layout for authentication pages.
 * No sidebar or header, just the content.
 * 
 * @module app/login/layout
 */

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Mauritius Meat Market',
  description: 'Sign in to your account',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
