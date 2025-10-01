/**
 * Mock Data Generator
 * 
 * Generates realistic mock data for development and testing.
 * This will be replaced with actual Odoo API calls in production.
 * 
 * @module lib/mockData
 */

import {
  User,
  Order,
  Customer,
  Product,
  SalesData,
  KPI,
  CustomerAnalytics,
  SalesDistribution,
  OrderStatus,
  ProductCategory,
} from '@/types';

/**
 * Generate mock user data
 * Simulates users from Odoo system
 */
export function generateMockUsers(): User[] {
  return [
    {
      id: 'user-001',
      name: 'Jean Michel',
      email: 'jean.michel@mmm.mu',
      role: 'admin',
      avatar: '👨‍💼',
      odooPartnerId: 1,
      lastLogin: new Date('2024-10-01T08:30:00'),
    },
    {
      id: 'user-002',
      name: 'Marie Lafitte',
      email: 'marie.lafitte@mmm.mu',
      role: 'salesman',
      avatar: '👩‍💼',
      odooPartnerId: 2,
      lastLogin: new Date('2024-10-01T09:15:00'),
    },
    {
      id: 'user-003',
      name: 'Raj Patel',
      email: 'raj.patel@mmm.mu',
      role: 'salesman',
      avatar: '👨‍💼',
      odooPartnerId: 3,
      lastLogin: new Date('2024-09-30T16:45:00'),
    },
  ];
}

/**
 * Generate mock product categories
 */
export function generateMockCategories(): ProductCategory[] {
  return [
    { id: 'cat-001', name: 'Fresh Meat' },
    { id: 'cat-002', name: 'Poultry' },
    { id: 'cat-003', name: 'Seafood' },
    { id: 'cat-004', name: 'Processed Meat' },
    { id: 'cat-005', name: 'Frozen Items' },
  ];
}

/**
 * Generate mock products
 * Simulates Odoo product.product records
 */
export function generateMockProducts(): Product[] {
  const categories = generateMockCategories();
  
  return [
    {
      id: 'prod-001',
      name: 'Premium Beef Steak',
      description: 'Grade A beef steak, locally sourced',
      sku: 'BEEF-STEAK-001',
      category: categories[0],
      price: 450,
      cost: 320,
      stockQuantity: 50,
      image: '🥩',
      isActive: true,
      uom: 'kg',
      odooProductId: 101,
    },
    {
      id: 'prod-002',
      name: 'Chicken Breast',
      description: 'Fresh chicken breast, boneless',
      sku: 'CHKN-BRST-001',
      category: categories[1],
      price: 180,
      cost: 120,
      stockQuantity: 120,
      image: '🍗',
      isActive: true,
      uom: 'kg',
      odooProductId: 102,
    },
    {
      id: 'prod-003',
      name: 'Fresh Tuna',
      description: 'Yellowfin tuna, caught daily',
      sku: 'TUNA-FRESH-001',
      category: categories[2],
      price: 650,
      cost: 480,
      stockQuantity: 30,
      image: '🐟',
      isActive: true,
      uom: 'kg',
      odooProductId: 103,
    },
    {
      id: 'prod-004',
      name: 'Pork Chops',
      description: 'Premium pork chops, bone-in',
      sku: 'PORK-CHOP-001',
      category: categories[0],
      price: 320,
      cost: 220,
      stockQuantity: 75,
      image: '🥓',
      isActive: true,
      uom: 'kg',
      odooProductId: 104,
    },
    {
      id: 'prod-005',
      name: 'Lamb Leg',
      description: 'Fresh lamb leg, whole',
      sku: 'LAMB-LEG-001',
      category: categories[0],
      price: 580,
      cost: 420,
      stockQuantity: 25,
      image: '🍖',
      isActive: true,
      uom: 'kg',
      odooProductId: 105,
    },
    {
      id: 'prod-006',
      name: 'Whole Chicken',
      description: 'Farm fresh whole chicken',
      sku: 'CHKN-WHOLE-001',
      category: categories[1],
      price: 220,
      cost: 150,
      stockQuantity: 90,
      image: '🐔',
      isActive: true,
      uom: 'piece',
      odooProductId: 106,
    },
    {
      id: 'prod-007',
      name: 'Prawns',
      description: 'Large tiger prawns, fresh',
      sku: 'PRAWN-LRG-001',
      category: categories[2],
      price: 720,
      cost: 550,
      stockQuantity: 40,
      image: '🦐',
      isActive: true,
      uom: 'kg',
      odooProductId: 107,
    },
    {
      id: 'prod-008',
      name: 'Beef Sausages',
      description: 'Premium beef sausages',
      sku: 'SAUS-BEEF-001',
      category: categories[3],
      price: 280,
      cost: 180,
      stockQuantity: 150,
      image: '🌭',
      isActive: true,
      uom: 'kg',
      odooProductId: 108,
    },
  ];
}

/**
 * Generate mock customers
 * Simulates Odoo res.partner records
 */
export function generateMockCustomers(): Customer[] {
  return [
    {
      id: 'cust-001',
      name: 'Le Gourmet Restaurant',
      email: 'orders@legourmet.mu',
      phone: '+230 5123 4567',
      address: '123 Royal Road',
      city: 'Port Louis',
      country: 'Mauritius',
      status: 'active',
      totalOrders: 45,
      totalSpent: 125000,
      lastOrderDate: '2024-09-28',
      billingAddress: '123 Royal Road, Port Louis',
      shippingAddress: '123 Royal Road, Port Louis',
      company: 'Le Gourmet Ltd',
      taxId: 'MU12345678',
      notes: 'Premium customer - weekly orders',
      odooPartnerId: 201,
      createdAt: '2023-01-15',
      updatedAt: '2024-09-28',
    },
    {
      id: 'cust-002',
      name: 'Ocean View Hotel',
      email: 'procurement@oceanview.mu',
      phone: '+230 5234 5678',
      address: '456 Coastal Road',
      city: 'Flic en Flac',
      country: 'Mauritius',
      status: 'active',
      totalOrders: 32,
      totalSpent: 89000,
      lastOrderDate: '2024-09-25',
      billingAddress: '456 Coastal Road, Flic en Flac',
      shippingAddress: '456 Coastal Road, Flic en Flac',
      company: 'Ocean View Hotels Ltd',
      taxId: 'MU23456789',
      notes: 'Large orders, monthly contract',
      odooPartnerId: 202,
      createdAt: '2023-03-20',
      updatedAt: '2024-09-25',
    },
    {
      id: 'cust-003',
      name: 'SuperMart Ltd',
      email: 'buying@supermart.mu',
      phone: '+230 5345 6789',
      address: '789 Market Street',
      city: 'Curepipe',
      country: 'Mauritius',
      status: 'active',
      totalOrders: 78,
      totalSpent: 234000,
      lastOrderDate: '2024-09-30',
      billingAddress: '789 Market Street, Curepipe',
      shippingAddress: 'Multiple locations',
      company: 'SuperMart Ltd',
      taxId: 'MU34567890',
      notes: 'Bulk orders, bi-weekly delivery',
      odooPartnerId: 203,
      createdAt: '2022-11-10',
      updatedAt: '2024-09-30',
    },
    {
      id: 'cust-004',
      name: 'Island Bistro',
      email: 'chef@islandbistro.mu',
      phone: '+230 5456 7890',
      address: '321 Beach Road',
      city: 'Grand Baie',
      country: 'Mauritius',
      status: 'active',
      totalOrders: 28,
      totalSpent: 56000,
      lastOrderDate: '2024-09-29',
      billingAddress: '321 Beach Road, Grand Baie',
      shippingAddress: '321 Beach Road, Grand Baie',
      company: 'Island Bistro SARL',
      taxId: 'MU45678901',
      notes: 'Specialty items preferred',
      odooPartnerId: 204,
      createdAt: '2023-06-05',
      updatedAt: '2024-09-29',
    },
    {
      id: 'cust-005',
      name: 'Fresh Foods Market',
      email: 'orders@freshfoods.mu',
      phone: '+230 5567 8901',
      address: '654 Main Street',
      city: 'Quatre Bornes',
      country: 'Mauritius',
      status: 'active',
      totalOrders: 52,
      totalSpent: 142000,
      lastOrderDate: '2024-09-27',
      billingAddress: '654 Main Street, Quatre Bornes',
      shippingAddress: '654 Main Street, Quatre Bornes',
      company: 'Fresh Foods Ltd',
      taxId: 'MU56789012',
      notes: 'Daily small orders',
      odooPartnerId: 205,
      createdAt: '2023-02-14',
      updatedAt: '2024-09-27',
    },
    {
      id: 'cust-006',
      name: 'Paradise Resort',
      email: 'kitchen@paradiseresort.mu',
      phone: '+230 5678 9012',
      address: '987 Coastal Highway',
      city: 'Belle Mare',
      country: 'Mauritius',
      status: 'active',
      totalOrders: 38,
      totalSpent: 168000,
      lastOrderDate: '2024-09-26',
      billingAddress: '987 Coastal Highway, Belle Mare',
      shippingAddress: '987 Coastal Highway, Belle Mare',
      company: 'Paradise Resort Group',
      taxId: 'MU67890123',
      notes: 'High-end cuts preferred, VIP customer',
      odooPartnerId: 206,
      createdAt: '2022-09-20',
      updatedAt: '2024-09-26',
    },
  ];
}

/**
 * Generate mock orders
 * Simulates Odoo sale.order records
 */
export function generateMockOrders(): Order[] {
  const products = generateMockProducts();
  const customers = generateMockCustomers();
  const users = generateMockUsers();
  
  const statuses: OrderStatus[] = ['shipping', 'received', 'pending', 'cancelled'];
  
  const orders: Order[] = [];
  
  // Generate 50 mock orders
  for (let i = 1; i <= 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const salesperson = users[Math.floor(Math.random() * users.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random number of items per order (1-4 items)
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0; // 30% chance of discount
      const itemSubtotalBeforeDiscount = product.price * quantity;
      const discountAmount = itemSubtotalBeforeDiscount * (discount / 100);
      const itemSubtotal = itemSubtotalBeforeDiscount - discountAmount;
      
      items.push({
        id: `item-${i}-${j}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        quantity,
        unitPrice: product.price,
        discount,
        subtotal: itemSubtotal,
        tax: itemSubtotal * 0.15, // 15% tax
      });
      
      subtotal += itemSubtotal;
    }
    
    const tax = subtotal * 0.15; // 15% VAT
    const total = subtotal + tax;
    
    // Generate date within last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);
    
    orders.push({
      id: `order-${String(i).padStart(3, '0')}`,
      orderNumber: `SO${String(i).padStart(4, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      date: orderDate.toISOString().split('T')[0],
      status,
      items,
      subtotal,
      tax,
      total,
      salespersonId: salesperson.id,
      salespersonName: salesperson.name,
      deliveryAddress: customer.shippingAddress,
      notes: '',
      createdAt: orderDate.toISOString(),
      updatedAt: orderDate.toISOString(),
      syncStatus: 'synced',
    });
  }
  
  // Sort by date (newest first)
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Generate mock sales data for charts
 */
export function generateMockSalesData(): SalesData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => ({
    month,
    onlineSales: Math.floor(Math.random() * 20000) + 10000,
    offlineSales: Math.floor(Math.random() * 8000) + 3000,
    returns: Math.floor(Math.random() * 1000) + 200,
  }));
}

/**
 * Generate mock sales distribution data
 */
export function generateMockSalesDistribution(): SalesDistribution[] {
  return [
    { name: 'Online sales', value: 65, color: '#4F46E5' },
    { name: 'Offline sales', value: 28, color: '#F59E0B' },
    { name: 'Returns', value: 7, color: '#EF4444' },
  ];
}

/**
 * Generate mock customer analytics
 */
export function generateMockCustomerAnalytics(): CustomerAnalytics[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => ({
    month,
    loyalCustomers: Math.floor(Math.random() * 2000) + 2000,
    newCustomers: Math.floor(Math.random() * 1500) + 500,
  }));
}

/**
 * Generate mock KPIs for dashboard
 */
export function generateMockKPIs(): KPI[] {
  return [
    {
      title: 'Total orders',
      value: '947',
      change: '+5%',
      trend: 'up',
      icon: 'shopping-cart',
    },
    {
      title: 'Total sales',
      value: '$28,407',
      change: '+3%',
      trend: 'up',
      icon: 'dollar-sign',
    },
    {
      title: 'Online sessions',
      value: '54,778',
      change: '+2%',
      trend: 'up',
      icon: 'users',
    },
    {
      title: 'Average order value',
      value: '$28.92',
      change: '-1%',
      trend: 'down',
      icon: 'trending-up',
    },
  ];
}

/**
 * Simulate API delay for realistic mock behavior
 */
export async function simulateApiDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
