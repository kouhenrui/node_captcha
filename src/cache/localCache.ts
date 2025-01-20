import { CacheAdapter } from './adapter';

export class LocalCache implements CacheAdapter {
  private cache: Map<string, { value: string; expireAt: number }>;

  constructor() {
    this.cache = new Map();
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    const expireAt = Date.now() + ttl * 1000; // TTL in milliseconds
    this.cache.set(key, { value, expireAt });
  }

  async get(key: string): Promise<string | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expireAt) {
      this.cache.delete(key); // Expired, remove from cache
      return null;
    }

    return entry.value;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exist(key: string):Promise<boolean> {
    //  await this.cache.get(key)
    const existValue=this.get(key)
    if (existValue==null)return false
    return true
  }
}
