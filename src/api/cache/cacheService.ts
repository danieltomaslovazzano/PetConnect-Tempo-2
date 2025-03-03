/**
 * Simple in-memory cache service
 */

interface CacheItem<T> {
  value: T;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to store
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    // Return null if item doesn't exist or has expired
    if (!item || item.expiry < Date.now()) {
      if (item) this.cache.delete(key); // Clean up expired item
      return null;
    }

    return item.value as T;
  }

  /**
   * Get all cache keys
   * @returns Array of all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Remove a value from the cache
   * @param key Cache key
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired items
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get a value from the cache or compute it if not found
   * @param key Cache key
   * @param compute Function to compute the value if not in cache
   * @param ttl Time to live in milliseconds
   * @returns The cached or computed value
   */
  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    ttl: number = this.defaultTTL,
  ): Promise<T> {
    const cachedValue = this.get<T>(key);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const computedValue = await compute();
    this.set(key, computedValue, ttl);
    return computedValue;
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
