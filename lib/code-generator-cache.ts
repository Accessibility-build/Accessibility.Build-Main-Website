/**
 * Client-side caching for Code Generator results
 * Uses localStorage to cache generated code for faster repeat access
 */

interface CacheKey {
  componentType: string;
  framework: string;
  wcagVersion: string;
  complianceLevel: string;
  descriptionHash: string;
}

interface CacheEntry {
  result: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = "code_gen_cache_";
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_ENTRIES = 20;

/**
 * Generate a simple hash from a string
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Create a cache key from generation parameters
 */
export function createCacheKey(params: {
  componentType: string;
  framework: string;
  wcagVersion: string;
  complianceLevel: string;
  description: string;
  customRequirements?: string;
}): string {
  const combined = `${params.componentType}|${params.framework}|${params.wcagVersion}|${params.complianceLevel}|${params.description}|${params.customRequirements || ""}`;
  return `${CACHE_PREFIX}${hashString(combined)}`;
}

/**
 * Get cached code generation result
 */
export function getCachedCode(cacheKey: string): any | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);

    // Check if cache has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return entry.result;
  } catch (error) {
    console.warn("Failed to read from cache:", error);
    return null;
  }
}

/**
 * Set cached code generation result
 */
export function setCachedCode(
  cacheKey: string,
  result: any,
  ttl: number = DEFAULT_TTL
): void {
  if (typeof window === "undefined") return;

  try {
    // Clean up old entries if we're at the limit
    cleanupCache();

    const entry: CacheEntry = {
      result,
      timestamp: Date.now(),
      ttl,
    };

    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn("Failed to write to cache:", error);
    // If storage is full, try to clear some space
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      clearOldestEntries(5);
      try {
        const entry: CacheEntry = { result, timestamp: Date.now(), ttl };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch {
        // Give up if we still can't write
      }
    }
  }
}

/**
 * Clear all cached code generation results
 */
export function clearCache(): void {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Clean up expired cache entries
 */
export function cleanupCache(): void {
  if (typeof window === "undefined") return;

  const entries: { key: string; timestamp: number }[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);

          // Remove expired entries
          if (Date.now() - entry.timestamp > entry.ttl) {
            localStorage.removeItem(key);
          } else {
            entries.push({ key, timestamp: entry.timestamp });
          }
        }
      } catch {
        // Remove corrupted entries
        localStorage.removeItem(key);
      }
    }
  }

  // If we still have too many entries, remove oldest ones
  if (entries.length > MAX_CACHE_ENTRIES) {
    entries.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
    toRemove.forEach(({ key }) => localStorage.removeItem(key));
  }
}

/**
 * Clear the oldest N cache entries
 */
function clearOldestEntries(count: number): void {
  const entries: { key: string; timestamp: number }[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);
          entries.push({ key, timestamp: entry.timestamp });
        }
      } catch {
        // Skip corrupted entries
      }
    }
  }

  entries.sort((a, b) => a.timestamp - b.timestamp);
  entries.slice(0, count).forEach(({ key }) => localStorage.removeItem(key));
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  entryCount: number;
  totalSize: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
} {
  if (typeof window === "undefined") {
    return { entryCount: 0, totalSize: 0, oldestEntry: null, newestEntry: null };
  }

  let entryCount = 0;
  let totalSize = 0;
  let oldestTimestamp = Infinity;
  let newestTimestamp = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        entryCount++;
        totalSize += value.length * 2; // Approximate UTF-16 size

        try {
          const entry: CacheEntry = JSON.parse(value);
          oldestTimestamp = Math.min(oldestTimestamp, entry.timestamp);
          newestTimestamp = Math.max(newestTimestamp, entry.timestamp);
        } catch {
          // Skip parsing errors
        }
      }
    }
  }

  return {
    entryCount,
    totalSize,
    oldestEntry: oldestTimestamp !== Infinity ? new Date(oldestTimestamp) : null,
    newestEntry: newestTimestamp !== 0 ? new Date(newestTimestamp) : null,
  };
}
