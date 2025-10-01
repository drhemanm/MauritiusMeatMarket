/**
 * Sync Store
 * 
 * Global state management for offline sync status using Zustand.
 * Manages online/offline state and sync operations.
 * 
 * @module lib/stores/syncStore
 */

import { create } from 'zustand';
import { SyncStatus } from '@/types';
import { offlineService } from '@/lib/offline/offlineService';

/**
 * Sync state interface
 */
interface SyncState {
  // State
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingItems: number;
  isSyncing: boolean;

  // Actions
  updateSyncStatus: (status: SyncStatus) => void;
  triggerSync: () => Promise<void>;
  initialize: () => void;
}

/**
 * Sync store
 * Manages offline sync state globally
 */
export const useSyncStore = create<SyncState>((set, get) => ({
  // Initial state
  isOnline: true,
  lastSyncTime: null,
  pendingItems: 0,
  isSyncing: false,

  /**
   * Update sync status
   * Called by offlineService when status changes
   * 
   * @param status - New sync status
   */
  updateSyncStatus: (status: SyncStatus) => {
    set({
      isOnline: status.isOnline,
      lastSyncTime: status.lastSyncTime,
      pendingItems: status.pendingItems,
      isSyncing: status.isSyncing,
    });
  },

  /**
   * Manually trigger sync
   */
  triggerSync: async () => {
    if (get().isOnline && !get().isSyncing) {
      set({ isSyncing: true });
      try {
        await offlineService.syncAll();
      } catch (error) {
        console.error('Manual sync failed:', error);
      } finally {
        set({ isSyncing: false });
      }
    }
  },

  /**
   * Initialize sync store
   * Subscribe to offlineService updates
   */
  initialize: () => {
    // Subscribe to offline service updates
    const unsubscribe = offlineService.subscribe((status) => {
      get().updateSyncStatus(status);
    });

    // Store unsubscribe function for cleanup
    // In a real app, you'd want to handle cleanup properly
  },
}));
