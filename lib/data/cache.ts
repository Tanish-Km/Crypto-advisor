interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const memoryCache = new Map<string, CacheItem<unknown>>();

export function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key) as CacheItem<T> | undefined;
  if (!item) return null;
  if (Date.now() - item.timestamp > item.ttlMs) {
    memoryCache.delete(key);
    return null;
  }
  return item.data;
}

export function setCached<T>(key: string, data: T, ttlSeconds: number = 300): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttlMs: ttlSeconds * 1000,
  });
}
