import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { CachedContent, Open5eEndpoint } from '@/types/open5e';

interface Open5eCacheDB extends DBSchema {
  'content-cache': {
    key: string;
    value: CachedContent<unknown>;
    indexes: {
      'by-endpoint': Open5eEndpoint;
      'by-timestamp': number;
    };
  };
  'bookmarks': {
    key: string;
    value: {
      id: string;
      name: string;
      category: Open5eEndpoint;
      slug: string;
      timestamp: number;
    };
  };
  'cache-metadata': {
    key: string;
    value: {
      totalSize: number;
      lastCleanup: number;
    };
  };
}

const DB_NAME = 'dnd-reference-cache';
const DB_VERSION = 1;
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

class CacheService {
  private db: IDBPDatabase<Open5eCacheDB> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<Open5eCacheDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Content cache store
        if (!db.objectStoreNames.contains('content-cache')) {
          const contentStore = db.createObjectStore('content-cache', { keyPath: 'data.slug' });
          contentStore.createIndex('by-endpoint', 'endpoint');
          contentStore.createIndex('by-timestamp', 'timestamp');
        }

        // Bookmarks store
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks', { keyPath: 'id' });
        }

        // Cache metadata store
        if (!db.objectStoreNames.contains('cache-metadata')) {
          const metaStore = db.createObjectStore('cache-metadata');
          metaStore.put({ totalSize: 0, lastCleanup: Date.now() }, 'metadata');
        }
      },
    });
  }

  private async ensureDb(): Promise<IDBPDatabase<Open5eCacheDB>> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  private estimateSize(obj: unknown): number {
    return new Blob([JSON.stringify(obj)]).size;
  }

  async getCacheSize(): Promise<number> {
    const db = await this.ensureDb();
    const metadata = await db.get('cache-metadata', 'metadata');
    return metadata?.totalSize || 0;
  }

  async updateCacheSize(delta: number): Promise<void> {
    const db = await this.ensureDb();
    const tx = db.transaction('cache-metadata', 'readwrite');
    const metadata = await tx.store.get('metadata') || { totalSize: 0, lastCleanup: Date.now() };
    metadata.totalSize = Math.max(0, metadata.totalSize + delta);
    await tx.store.put(metadata, 'metadata');
    await tx.done;
  }

  async cleanupOldEntries(): Promise<void> {
    const db = await this.ensureDb();
    const cutoffTime = Date.now() - CACHE_DURATION;
    
    const tx = db.transaction(['content-cache', 'cache-metadata'], 'readwrite');
    const index = tx.objectStore('content-cache').index('by-timestamp');
    
    let totalDeleted = 0;
    for await (const cursor of index.iterate()) {
      if (cursor.value.timestamp < cutoffTime) {
        const size = this.estimateSize(cursor.value);
        await cursor.delete();
        totalDeleted += size;
      }
    }

    if (totalDeleted > 0) {
      await this.updateCacheSize(-totalDeleted);
    }

    const metadata = await tx.objectStore('cache-metadata').get('metadata');
    if (metadata) {
      metadata.lastCleanup = Date.now();
      await tx.objectStore('cache-metadata').put(metadata, 'metadata');
    }

    await tx.done;
  }

  async ensureCacheSpace(requiredSpace: number): Promise<boolean> {
    const currentSize = await this.getCacheSize();
    
    if (currentSize + requiredSpace <= MAX_CACHE_SIZE) {
      return true;
    }

    // Clean up old entries first
    await this.cleanupOldEntries();
    
    const sizeAfterCleanup = await this.getCacheSize();
    if (sizeAfterCleanup + requiredSpace <= MAX_CACHE_SIZE) {
      return true;
    }

    // If still not enough space, remove oldest entries until we have space
    const db = await this.ensureDb();
    const tx = db.transaction(['content-cache'], 'readwrite');
    const index = tx.objectStore('content-cache').index('by-timestamp');
    
    let freedSpace = 0;
    const spaceNeeded = (sizeAfterCleanup + requiredSpace) - MAX_CACHE_SIZE;
    
    for await (const cursor of index.iterate()) {
      if (freedSpace >= spaceNeeded) break;
      
      const size = this.estimateSize(cursor.value);
      await cursor.delete();
      freedSpace += size;
    }

    await tx.done;
    
    if (freedSpace > 0) {
      await this.updateCacheSize(-freedSpace);
    }

    return true;
  }

  async get<T>(endpoint: Open5eEndpoint, slug: string): Promise<T | null> {
    const db = await this.ensureDb();
    const key = `${endpoint}:${slug}`;
    
    try {
      const cached = await db.get('content-cache', key);
      if (!cached) return null;

      // Check if cache is expired
      if (Date.now() - cached.timestamp > CACHE_DURATION) {
        await this.delete(endpoint, slug);
        return null;
      }

      return cached.data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(endpoint: Open5eEndpoint, slug: string, data: T): Promise<void> {
    const db = await this.ensureDb();
    const key = `${endpoint}:${slug}`;
    
    const content: CachedContent<T> = {
      data,
      timestamp: Date.now(),
      endpoint,
    };

    const size = this.estimateSize(content);
    
    // Ensure we have space
    const hasSpace = await this.ensureCacheSpace(size);
    if (!hasSpace) {
      console.warn('Cache is full, unable to store content');
      return;
    }

    try {
      // Check if we're updating existing content
      const existing = await db.get('content-cache', key);
      const existingSize = existing ? this.estimateSize(existing) : 0;

      await db.put('content-cache', content);
      
      // Update cache size
      await this.updateCacheSize(size - existingSize);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(endpoint: Open5eEndpoint, slug: string): Promise<void> {
    const db = await this.ensureDb();
    const key = `${endpoint}:${slug}`;
    
    try {
      const existing = await db.get('content-cache', key);
      if (existing) {
        const size = this.estimateSize(existing);
        await db.delete('content-cache', key);
        await this.updateCacheSize(-size);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async getByEndpoint<T>(endpoint: Open5eEndpoint): Promise<T[]> {
    const db = await this.ensureDb();
    const tx = db.transaction('content-cache', 'readonly');
    const index = tx.objectStore('content-cache').index('by-endpoint');
    
    const results: T[] = [];
    const cutoffTime = Date.now() - CACHE_DURATION;
    
    for await (const cursor of index.iterate(endpoint)) {
      if (cursor.value.timestamp >= cutoffTime) {
        results.push(cursor.value.data as T);
      }
    }

    return results;
  }

  async addBookmark(id: string, name: string, category: Open5eEndpoint, slug: string): Promise<void> {
    const db = await this.ensureDb();
    await db.put('bookmarks', {
      id,
      name,
      category,
      slug,
      timestamp: Date.now(),
    });
  }

  async removeBookmark(id: string): Promise<void> {
    const db = await this.ensureDb();
    await db.delete('bookmarks', id);
  }

  async getBookmarks() {
    const db = await this.ensureDb();
    return db.getAll('bookmarks');
  }

  async isBookmarked(id: string): Promise<boolean> {
    const db = await this.ensureDb();
    const bookmark = await db.get('bookmarks', id);
    return !!bookmark;
  }

  async clear(): Promise<void> {
    const db = await this.ensureDb();
    
    await db.clear('content-cache');
    await db.clear('bookmarks');
    await db.put('cache-metadata', { totalSize: 0, lastCleanup: Date.now() }, 'metadata');
  }

  async getCacheStats() {
    const db = await this.ensureDb();
    const metadata = await db.get('cache-metadata', 'metadata');
    const contentCount = await db.count('content-cache');
    const bookmarkCount = await db.count('bookmarks');

    return {
      totalSize: metadata?.totalSize || 0,
      maxSize: MAX_CACHE_SIZE,
      percentUsed: ((metadata?.totalSize || 0) / MAX_CACHE_SIZE) * 100,
      contentCount,
      bookmarkCount,
      lastCleanup: metadata?.lastCleanup || Date.now(),
    };
  }
}

export const cacheService = new CacheService();