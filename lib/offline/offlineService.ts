/**
 * Offline Sync Service
 * 
 * Manages offline functionality using IndexedDB for local storage.
 * Queues operations when offline and syncs when connection is restored.
 * Implements a robust offline-first architecture.
 * 
 * @module lib/offline/offlineService
 */

import { SYNC_CONFIG } from '@/lib/config';
import { OfflineQueueItem, SyncStatus, Order, Customer, Product } from '@/types';
import { odooService } from '@/lib/odoo/odooService';

/**
 * IndexedDB database instance
 */
let db: IDBDatabase | null = null;

/**
 * Offline Service Class
 * Handles all offline data management and synchronization
 */
class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeOfflineMode();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  /**
   * Initialize offline mode
   * Sets up IndexedDB and network listeners
   */
  private async initializeOfflineMode(): Promise<void> {
    if (!SYNC_CONFIG.enabled) {
      console.log('Offline mode is disabled');
      return;
    }

    try {
      // Initialize IndexedDB
      await this.initializeDatabase();

      // Set up network status listeners
      this.setupNetworkListeners();

      // Start sync interval
      this.startSyncInterval();

      // Initial sync if online
      if (this.isOnline) {
        await this.syncAll();
      }

      console.log('Offline service initialized successfully');
    } catch (error) {
      console.error('Error initializing offline service:', error);
    }
  }

  /**
   * Initialize IndexedDB database
   * Creates object stores for orders, customers, products, and sync queue
   */
  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(SYNC_CONFIG.dbName, SYNC_CONFIG.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        db = request.result;
        console.log('IndexedDB opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!database.objectStoreNames.contains(SYNC_CONFIG.stores.orders)) {
          const ordersStore = database.createObjectStore(SYNC_CONFIG.stores.orders, {
            keyPath: 'id',
          });
          ordersStore.createIndex('customerId', 'customerId', { unique: false });
          ordersStore.createIndex('date', 'date', { unique: false });
          ordersStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        if (!database.objectStoreNames.contains(SYNC_CONFIG.stores.customers)) {
          const customersStore = database.createObjectStore(SYNC_CONFIG.stores.customers, {
            keyPath: 'id',
          });
          customersStore.createIndex('email', 'email', { unique: false });
          customersStore.createIndex('status', 'status', { unique: false });
        }

        if (!database.objectStoreNames.contains(SYNC_CONFIG.stores.products)) {
          const productsStore = database.createObjectStore(SYNC_CONFIG.stores.products, {
            keyPath: 'id',
          });
          productsStore.createIndex('sku', 'sku', { unique: false });
          productsStore.createIndex('category', 'category.id', { unique: false });
        }

        if (!database.objectStoreNames.contains(SYNC_CONFIG.stores.queue)) {
          const queueStore = database.createObjectStore(SYNC_CONFIG.stores.queue, {
            keyPath: 'id',
            autoIncrement: true,
          });
          queueStore.createIndex('status', 'status', { unique: false });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('IndexedDB schema upgraded');
      };
    });
  }

  /**
   * Set up network status listeners
   * Monitors online/offline events
   */
  private setupNetworkListeners(): void {
    this.isOnline = navigator.onLine;

    window.addEventListener('online', async () => {
      console.log('Connection restored - starting sync');
      this.isOnline = true;
      this.notifyListeners();
      await this.syncAll();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost - switching to offline mode');
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  /**
   * Start automatic sync interval
   */
  private startSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      if (this.isOnline && !this.syncInProgress) {
        await this.syncAll();
      }
    }, SYNC_CONFIG.interval);
  }

  /**
   * Stop automatic sync interval
   */
  private stopSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // ==================== ORDERS OFFLINE STORAGE ====================

  /**
   * Save order to local IndexedDB
   * 
   * @param order - Order to save
   */
  public async saveOrderLocally(order: Order): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.orders], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.orders);
      const request = store.put(order);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all orders from local storage
   * 
   * @returns Array of orders
   */
  public async getLocalOrders(): Promise<Order[]> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.orders], 'readonly');
      const store = transaction.objectStore(SYNC_CONFIG.stores.orders);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get order by ID from local storage
   * 
   * @param orderId - Order ID
   * @returns Order or undefined
   */
  public async getLocalOrderById(orderId: string): Promise<Order | undefined> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.orders], 'readonly');
      const store = transaction.objectStore(SYNC_CONFIG.stores.orders);
      const request = store.get(orderId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete order from local storage
   * 
   * @param orderId - Order ID
   */
  public async deleteLocalOrder(orderId: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.orders], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.orders);
      const request = store.delete(orderId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Create offline order with signature
   * Used when creating orders offline
   * 
   * @param orderData - Order data
   * @returns Created order
   */
  public async createOfflineOrder(orderData: any): Promise<Order> {
    // Generate local order number
    const timestamp = Date.now();
    const localOrderNumber = `LOCAL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(timestamp).slice(-4)}`;
    
    // Calculate totals
    const itemsWithCalculations = orderData.items.map((item: any, index: number) => {
      const subtotalBeforeDiscount = item.quantity * item.unitPrice;
      const discountAmount = subtotalBeforeDiscount * (item.discount || 0) / 100;
      const subtotal = subtotalBeforeDiscount - discountAmount;
      
      return {
        id: `item-${timestamp}-${index}`,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        subtotal: subtotal,
      };
    });

    const subtotal = itemsWithCalculations.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const offlineOrder: Order = {
      id: `offline-${timestamp}`,
      orderNumber: localOrderNumber,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: itemsWithCalculations,
      subtotal: subtotal,
      tax: tax,
      total: total,
      salespersonId: orderData.salespersonId || '',
      salespersonName: orderData.salespersonName || '',
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    // Save to IndexedDB
    await this.saveOrderLocally(offlineOrder);

    // Add to sync queue
    await this.addToSyncQueue({
      type: 'order',
      action: 'create',
      data: {
        ...orderData,
        localOrderId: offlineOrder.id,
        localOrderNumber: localOrderNumber,
      },
    });

    return offlineOrder;
  }

  // ==================== CUSTOMERS OFFLINE STORAGE ====================

  /**
   * Save customer to local IndexedDB
   * 
   * @param customer - Customer to save
   */
  public async saveCustomerLocally(customer: Customer): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.customers], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.customers);
      const request = store.put(customer);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all customers from local storage
   * 
   * @returns Array of customers
   */
  public async getLocalCustomers(): Promise<Customer[]> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.customers], 'readonly');
      const store = transaction.objectStore(SYNC_CONFIG.stores.customers);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== PRODUCTS OFFLINE STORAGE ====================

  /**
   * Save product to local IndexedDB
   * 
   * @param product - Product to save
   */
  public async saveProductLocally(product: Product): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.products], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.products);
      const request = store.put(product);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all products from local storage
   * 
   * @returns Array of products
   */
  public async getLocalProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.products], 'readonly');
      const store = transaction.objectStore(SYNC_CONFIG.stores.products);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== SYNC QUEUE MANAGEMENT ====================

  /**
   * Add item to sync queue
   * Queues operations to be synced when online
   * 
   * @param item - Queue item to add
   */
  public async addToSyncQueue(item: Omit<OfflineQueueItem, 'id'>): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.queue], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.queue);
      const request = store.add({
        ...item,
        timestamp: new Date(),
        retryCount: 0,
        status: 'pending',
      });

      request.onsuccess = () => {
        console.log('Item added to sync queue:', item.type, item.action);
        this.notifyListeners();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending items from sync queue
   * 
   * @returns Array of pending queue items
   */
  public async getPendingQueueItems(): Promise<OfflineQueueItem[]> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.queue], 'readonly');
      const store = transaction.objectStore(SYNC_CONFIG.stores.queue);
      const index = store.index('status');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update queue item status
   * 
   * @param itemId - Queue item ID
   * @param status - New status
   * @param error - Optional error message
   */
  public async updateQueueItemStatus(
    itemId: string,
    status: OfflineQueueItem['status'],
    error?: string
  ): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.queue], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.queue);
      const getRequest = store.get(itemId);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          if (error) item.error = error;
          if (status === 'failed') item.retryCount++;

          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => {
            this.notifyListeners();
            resolve();
          };
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Queue item not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Delete completed queue item
   * 
   * @param itemId - Queue item ID
   */
  public async deleteQueueItem(itemId: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([SYNC_CONFIG.stores.queue], 'readwrite');
      const store = transaction.objectStore(SYNC_CONFIG.stores.queue);
      const request = store.delete(itemId);

      request.onsuccess = () => {
        this.notifyListeners();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== SYNCHRONIZATION ====================

  /**
   * Sync all pending items with server
   * Processes sync queue and updates local data
   */
  public async syncAll(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    this.notifyListeners();

    try {
      console.log('Starting sync process...');

      // Get pending queue items
      const pendingItems = await this.getPendingQueueItems();
      console.log(`Found ${pendingItems.length} items to sync`);

      // Process each queue item
      for (const item of pendingItems) {
        if (item.retryCount >= SYNC_CONFIG.maxRetryAttempts) {
          console.error(`Max retry attempts reached for item:`, item);
          await this.updateQueueItemStatus(item.id, 'failed', 'Max retry attempts exceeded');
          continue;
        }

        try {
          await this.updateQueueItemStatus(item.id, 'syncing');
          await this.processSyncItem(item);
          await this.updateQueueItemStatus(item.id, 'completed');
          await this.deleteQueueItem(item.id);
          console.log(`Successfully synced item:`, item.type, item.action);
        } catch (error) {
          console.error(`Error syncing item:`, error);
          await this.updateQueueItemStatus(
            item.id,
            'failed',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      }

      // Download fresh data from server
      await this.downloadServerData();

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }
  }

  /**
   * Process individual sync queue item
   * 
   * @param item - Queue item to process
   */
  private async processSyncItem(item: OfflineQueueItem): Promise<void> {
    switch (item.type) {
      case 'order':
        await this.syncOrder(item);
        break;
      case 'customer':
        await this.syncCustomer(item);
        break;
      case 'product':
        await this.syncProduct(item);
        break;
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }

  /**
   * Sync order with server
   * 
   * @param item - Queue item
   */
  private async syncOrder(item: OfflineQueueItem): Promise<void> {
    switch (item.action) {
      case 'create':
        await odooService.createOrder(item.data);
        break;
      case 'update':
        await odooService.updateOrder(item.data.id, item.data);
        break;
      case 'delete':
        await odooService.cancelOrder(item.data.id);
        break;
    }
  }

  /**
   * Sync customer with server
   * 
   * @param item - Queue item
   */
  private async syncCustomer(item: OfflineQueueItem): Promise<void> {
    switch (item.action) {
      case 'create':
        await odooService.createCustomer(item.data);
        break;
      case 'update':
        await odooService.updateCustomer(item.data.id, item.data);
        break;
    }
  }

  /**
   * Sync product with server (usually read-only)
   * 
   * @param item - Queue item
   */
  private async syncProduct(item: OfflineQueueItem): Promise<void> {
    // Products are typically read-only from Odoo
    console.log('Product sync not implemented (read-only)');
  }

  /**
   * Download fresh data from server
   * Updates local IndexedDB with server data
   */
  private async downloadServerData(): Promise<void> {
    try {
      // Download orders
      const ordersResponse = await odooService.getOrders(undefined, 1, 100);
      for (const order of ordersResponse.data) {
        await this.saveOrderLocally(order);
      }

      // Download customers
      const customersResponse = await odooService.getCustomers(undefined, 1, 100);
      for (const customer of customersResponse.data) {
        await this.saveCustomerLocally(customer);
      }

      // Download products
      const productsResponse = await odooService.getProducts(1, 100);
      for (const product of productsResponse.data) {
        await this.saveProductLocally(product);
      }

      console.log('Server data downloaded successfully');
    } catch (error) {
      console.error('Error downloading server data:', error);
    }
  }

  // ==================== STATUS & LISTENERS ====================

  /**
   * Get current sync status
   * 
   * @returns Current sync status
   */
  public async getSyncStatus(): Promise<SyncStatus> {
    const pendingItems = await this.getPendingQueueItems();

    return {
      isOnline: this.isOnline,
      lastSyncTime: null, // TODO: Store last sync time
      pendingItems: pendingItems.length,
      isSyncing: this.syncInProgress,
    };
  }

  /**
   * Check if currently online
   * 
   * @returns True if online
   */
  public isCurrentlyOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to sync status changes
   * 
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  public subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener);
    
    // Send initial status
    this.getSyncStatus().then(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(): void {
    this.getSyncStatus().then(status => {
      this.listeners.forEach(listener => listener(status));
    });
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.stopSyncInterval();
    if (db) {
      db.close();
      db = null;
    }
  }
}

// Export singleton instance
export const offlineService = OfflineService.getInstance();
