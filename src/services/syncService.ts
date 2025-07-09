import { useCharacterStore } from '@/stores/characterStore';
import type { Character } from '@/types/character';

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  data?: Character;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'dnd-sync-queue';
const SYNC_TAG = 'character-sync';

class SyncService {
  private syncQueue: SyncQueueItem[] = [];

  constructor() {
    this.loadQueue();
    this.registerBackgroundSync();
    
    // Listen for online status
    window.addEventListener('online', () => {
      this.attemptSync();
    });
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private async registerBackgroundSync() {
    if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
      console.log('Background sync not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        // @ts-expect-error - Background Sync API types
        await registration.sync.register(SYNC_TAG);
        console.log('Background sync registered');
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }

  async queueAction(action: 'create' | 'update' | 'delete', character?: Character, id?: string) {
    const item: SyncQueueItem = {
      id: id || character?.id || crypto.randomUUID(),
      action,
      data: character,
      timestamp: Date.now(),
    };

    this.syncQueue.push(item);
    this.saveQueue();

    // Try to sync immediately if online
    if (navigator.onLine) {
      await this.attemptSync();
    } else {
      // Register for background sync when back online
      await this.registerBackgroundSync();
    }
  }

  async attemptSync() {
    if (!navigator.onLine || this.syncQueue.length === 0) {
      return;
    }

    console.log(`Attempting to sync ${this.syncQueue.length} items`);
    const failedItems: SyncQueueItem[] = [];

    for (const item of this.syncQueue) {
      try {
        await this.syncItem(item);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        failedItems.push(item);
      }
    }

    // Update queue with only failed items
    this.syncQueue = failedItems;
    this.saveQueue();

    if (failedItems.length > 0) {
      console.warn(`${failedItems.length} items failed to sync`);
      // Register for retry
      await this.registerBackgroundSync();
    } else {
      console.log('All items synced successfully');
    }
  }

  private async syncItem(item: SyncQueueItem) {
    // In a real app, this would sync to a server
    // For now, we'll just simulate the sync
    console.log(`Syncing ${item.action} for character ${item.id}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated sync failure');
    }
  }

  // Hook into character store actions
  setupStoreSync() {
    const store = useCharacterStore.getState();
    const originalAddCharacter = store.addCharacter;
    const originalUpdateCharacter = store.updateCharacter;
    const originalDeleteCharacter = store.deleteCharacter;

    useCharacterStore.setState({
      addCharacter: (character: Character) => {
        originalAddCharacter(character);
        this.queueAction('create', character);
      },
      updateCharacter: (id: string, updates: Partial<Character>) => {
        originalUpdateCharacter(id, updates);
        const updatedCharacter = useCharacterStore.getState().characters.find((c: Character) => c.id === id);
        if (updatedCharacter) {
          this.queueAction('update', updatedCharacter);
        }
      },
      deleteCharacter: (id: string) => {
        originalDeleteCharacter(id);
        this.queueAction('delete', undefined, id);
      },
    });
  }

  // Get sync status
  getSyncStatus() {
    return {
      pendingCount: this.syncQueue.length,
      isOnline: navigator.onLine,
      oldestPending: this.syncQueue.length > 0 
        ? new Date(Math.min(...this.syncQueue.map(item => item.timestamp)))
        : null,
    };
  }

  // Clear sync queue (for testing/debugging)
  clearQueue() {
    this.syncQueue = [];
    this.saveQueue();
  }
}

export const syncService = new SyncService();