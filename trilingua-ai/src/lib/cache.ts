/**
 * Simple in-memory cache for demo use.
 * Avoids Redis dependency while supporting basic TTL-based caching.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxSize = 500;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds = 300): void {
    // Evict oldest entries if at capacity
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /**
   * Get or compute a value, caching the result.
   */
  async getOrSet<T>(
    key: string,
    compute: () => Promise<T>,
    ttlSeconds = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = await compute();
    this.set(key, value, ttlSeconds);
    return value;
  }
}

// Singleton cache instance
const globalForCache = globalThis as unknown as {
  cache: MemoryCache | undefined;
};

export const cache = globalForCache.cache ?? new MemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.cache = cache;
}
