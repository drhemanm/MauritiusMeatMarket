/**
 * Odoo API Service
 * 
 * Handles all communication with Odoo 18 ERP system.
 * Provides methods for CRUD operations on Odoo models.
 * Currently uses mock data - will be replaced with actual Odoo XML-RPC/JSON-RPC calls.
 * 
 * @module lib/odoo/odooService
 */

import { ODOO_CONFIG, API_CONFIG } from '@/lib/config';
import { authService } from '@/lib/auth/authService';
import { offlineService } from '@/lib/offline/offlineService';
import {
  Order,
  Customer,
  Product,
  CreateOrderData,
  OrderFilters,
  CustomerFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types';
import {
  generateMockOrders,
  generateMockCustomers,
  generateMockProducts,
  simulateApiDelay,
} from '@/lib/mockData';

/**
 * Odoo API Service Class
 * Handles all interactions with Odoo backend
 */
class OdooService {
  private static instance: OdooService;
  private baseUrl: string;
  private sessionId: string | null = null;

  private constructor() {
    this.baseUrl = ODOO_CONFIG.url;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OdooService {
    if (!OdooService.instance) {
      OdooService.instance = new OdooService();
    }
    return OdooService.instance;
  }

  /**
   * Get authentication headers for Odoo API requests
   */
  private getHeaders(): HeadersInit {
    const token = authService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Generic API call wrapper with error handling
   * 
   * @param endpoint - API endpoint
   * @param options - Fetch options
   * @returns API response
   */
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_CONFIG.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('API call error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // ==================== ORDERS ====================

  /**
   * Fetch orders from Odoo
   * Maps to Odoo sale.order model
   * 
   * @param filters - Optional filters for orders
   * @param page - Page number for pagination
   * @param pageSize - Number of items per page
   * @returns Paginated order list
   */
  public async getOrders(
    filters?: OrderFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Order>> {
    try {
      // Simulate API delay
      await simulateApiDelay(800);

      // TODO: Replace with actual Odoo API call
      // const response = await this.apiCall<Order[]>('/odoo/orders', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     model: 'sale.order',
      //     method: 'search_read',
      //     args: [this.buildOrderDomain(filters)],
      //     kwargs: {
      //       fields: ['name', 'partner_id', 'amount_total', 'state', 'date_order'],
      //       limit: pageSize,
      //       offset: (page - 1) * pageSize,
      //     },
      //   }),
      // });

      // Mock implementation
      let orders = generateMockOrders();

      // Apply filters
      if (filters) {
        orders = this.applyOrderFilters(orders, filters);
      }

      // Pagination
      const total = orders.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedOrders = orders.slice(startIndex, endIndex);

      return {
        data: paginatedOrders,
        total,
        page,
        pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get single order by ID
   * 
   * @param orderId - Order ID
   * @returns Order details
   */
  public async getOrderById(orderId: string): Promise<Order | null> {
    try {
      await simulateApiDelay(500);

      // TODO: Replace with actual Odoo API call
      // const response = await this.apiCall<Order>(`/odoo/orders/${orderId}`, {
      //   method: 'GET',
      // });

      // Mock implementation
      const orders = generateMockOrders();
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Create new order in Odoo with invoice generation
   * 
   * @param orderData - Order data with discount and signature
   * @returns Created order with invoice information
   */
  public async createOrder(orderData: CreateOrderData): Promise<{
    order: Order;
    invoice?: {
      id: string;
      name: string;
      state: string;
      pdf_url?: string;
      amount_total: number;
    };
    mra_status?: string;
  }> {
    try {
      await simulateApiDelay(1500);

      // TODO: Replace with actual Odoo API call
      // const response = await this.apiCall<any>('/odoo/orders/create', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     model: 'sale.order',
      //     method: 'create_from_portal',
      //     args: [{
      //       partner_id: orderData.customerId,
      //       order_line: orderData.items.map(item => [0, 0, {
      //         product_id: item.productId,
      //         product_uom_qty: item.quantity,
      //         price_unit: item.unitPrice,
      //         discount: item.discount || 0,
      //       }]),
      //       note: orderData.notes,
      //       client_order_ref: orderData.deliveryAddress,
      //       signature_image: orderData.signature,
      //     }],
      //   }),
      // });

      // Mock implementation
      const user = authService.getCurrentUser();
      const orders = generateMockOrders();
      const customers = generateMockCustomers();
      const customer = customers.find(c => c.id === orderData.customerId);

      // Calculate totals with discount
      const itemsWithCalculations = orderData.items.map((item, index) => {
        const subtotalBeforeDiscount = item.quantity * item.unitPrice;
        const discountAmount = subtotalBeforeDiscount * (item.discount || 0) / 100;
        const subtotal = subtotalBeforeDiscount - discountAmount;
        
        return {
          id: `item-${Date.now()}-${index}`,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          subtotal: subtotal,
        };
      });

      const subtotal = itemsWithCalculations.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.15; // 15% VAT
      const total = subtotal + tax;

      // Create order number
      const orderNumber = `SO${String(orders.length + 1).padStart(4, '0')}`;
      const invoiceNumber = `INV-2025-${String(orders.length + 1).padStart(5, '0')}`;

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: orderNumber,
        customerId: orderData.customerId,
        customerName: customer?.name || 'Unknown Customer',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        items: itemsWithCalculations,
        subtotal: subtotal,
        tax: tax,
        total: total,
        salespersonId: user?.id || '',
        salespersonName: user?.name || '',
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: 'synced',
      };

      // Simulate invoice creation
      const invoice = {
        id: `inv-${Date.now()}`,
        name: invoiceNumber,
        state: 'posted',
        pdf_url: `/api/invoices/${invoiceNumber}/pdf`,
        amount_total: total,
      };

      console.log('Order created:', orderNumber);
      console.log('Invoice created:', invoiceNumber);
      console.log('Signature saved:', orderData.signature ? 'Yes' : 'No');

      // Return order with invoice
      return {
        order: newOrder,
        invoice: invoice,
        mra_status: 'submitted',
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update existing order
   * 
   * @param orderId - Order ID
   * @param updates - Order updates
   * @returns Updated order
   */
  public async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    try {
      await simulateApiDelay(800);

      // TODO: Replace with actual Odoo API call
      // const response = await this.apiCall<Order>(`/odoo/orders/${orderId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({
      //     model: 'sale.order',
      //     method: 'write',
      //     args: [parseInt(orderId), updates],
      //   }),
      // });

      // Mock implementation
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      return {
        ...order,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   * 
   * @param orderId - Order ID
   * @returns Success status
   */
  public async cancelOrder(orderId: string): Promise<boolean> {
    try {
      await simulateApiDelay(600);

      // TODO: Replace with actual Odoo API call
      // await this.apiCall(`/odoo/orders/${orderId}/cancel`, {
      //   method: 'POST',
      // });

      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  }

  // ==================== CUSTOMERS ====================

  /**
   * Fetch customers from Odoo
   * Maps to Odoo res.partner model
   * 
   * @param filters - Optional filters
   * @param page - Page number
   * @param pageSize - Items per page
   * @returns Paginated customer list
   */
  public async getCustomers(
    filters?: CustomerFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Customer>> {
    try {
      await simulateApiDelay(700);

      // TODO: Replace with actual Odoo API call
      // const response = await this.apiCall<Customer[]>('/odoo/customers', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     model: 'res.partner',
      //     method: 'search_read',
      //     args: [this.buildCustomerDomain(filters)],
      //     kwargs: {
      //       fields: ['name', 'email', 'phone', 'customer_rank'],
      //       limit: pageSize,
      //       offset: (page - 1) * pageSize,
      //     },
      //   }),
      // });

      // Mock implementation
      let customers = generateMockCustomers();

      // Apply filters
      if (filters) {
        customers = this.applyCustomerFilters(customers, filters);
      }

      // Pagination
      const total = customers.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCustomers = customers.slice(startIndex, endIndex);

      return {
        data: paginatedCustomers,
        total,
        page,
        pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get single customer by ID
   * 
   * @param customerId - Customer ID
   * @returns Customer details
   */
  public async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      await simulateApiDelay(500);

      // TODO: Replace with actual Odoo API call

      // Mock implementation
      const customers = generateMockCustomers();
      return customers.find(customer => customer.id === customerId) || null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  /**
   * Create new customer
   * 
   * @param customerData - Customer data
   * @returns Created customer
   */
  public async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      await simulateApiDelay(900);

      // TODO: Replace with actual Odoo API call

      // Mock implementation
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        city: customerData.city || '',
        country: customerData.country || 'Mauritius',
        status: 'active',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: new Date().toISOString().split('T')[0],
        billingAddress: customerData.billingAddress,
        shippingAddress: customerData.shippingAddress,
        company: customerData.company,
        taxId: customerData.taxId,
        notes: customerData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Update customer
   * 
   * @param customerId - Customer ID
   * @param updates - Customer updates
   * @returns Updated customer
   */
  public async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      await simulateApiDelay(800);

      // TODO: Replace with actual Odoo API call

      // Mock implementation
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      return {
        ...customer,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // ==================== PRODUCTS ====================

  /**
   * Fetch products from Odoo
   * Maps to Odoo product.product model
   * 
   * @param page - Page number
   * @param pageSize - Items per page
   * @returns Paginated product list
   */
  public async getProducts(
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Product>> {
    try {
      await simulateApiDelay(600);

      // TODO: Replace with actual Odoo API call

      // Mock implementation
      const products = generateMockProducts();
      const total = products.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = products.slice(startIndex, endIndex);

      return {
        data: paginatedProducts,
        total,
        page,
        pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Search products by name or SKU
   * 
   * @param query - Search query
   * @returns Matching products
   */
  public async searchProducts(query: string): Promise<Product[]> {
    try {
      await simulateApiDelay(400);

      // TODO: Replace with actual Odoo API call

      // Mock implementation
      const products = generateMockProducts();
      const lowerQuery = query.toLowerCase();
      
      return products.filter(
        product =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.sku.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Apply filters to orders (mock implementation)
   */
  private applyOrderFilters(orders: Order[], filters: OrderFilters): Order[] {
    let filtered = [...orders];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(order => filters.status!.includes(order.status));
    }

    if (filters.customerId) {
      filtered = filtered.filter(order => order.customerId === filters.customerId);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(order => order.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(order => order.date <= filters.dateTo!);
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(order => order.total >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(order => order.total <= filters.maxAmount!);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  /**
   * Apply filters to customers (mock implementation)
   */
  private applyCustomerFilters(customers: Customer[], filters: CustomerFilters): Customer[] {
    let filtered = [...customers];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(customer => filters.status!.includes(customer.status));
    }

    if (filters.minOrders !== undefined) {
      filtered = filtered.filter(customer => customer.totalOrders >= filters.minOrders!);
    }

    if (filters.minSpent !== undefined) {
      filtered = filtered.filter(customer => customer.totalSpent >= filters.minSpent!);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        customer =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query)
      );
    }

    return filtered;
  }
}

// Export singleton instance
export const odooService = OdooService.getInstance();
