/**
 * Root Layout
 * 
 * Main application layout with metadata and font configuration.
 * 
 * @module app/layout
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mauritius Meat Market - Salesman Portal',
  description: 'Integrated salesman portal for Odoo 18',
  keywords: ['Odoo', 'ERP', 'Sales', 'CRM', 'Mauritius'],
  authors: [{ name: 'drhemanm' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
