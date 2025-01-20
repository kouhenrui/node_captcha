import Redis from 'ioredis-mock';
import { CacheManager } from '../src/cache/cacheManager';

describe('CacheManager Tests', () => {
  let redisClient:any;

  beforeAll(() => {
    // Initialize Redis client for testing
    redisClient = new Redis();
  });

  afterAll(async () => {
    // Disconnect Redis client after tests
    await redisClient.disconnect();
  });

  test('should store and retrieve data using local cache', async () => {
    const cacheManager = new CacheManager(false); // Use local cache

    const key = 'localTestKey';
    const value = 'localTestValue';
    const ttl = 2; // 2 seconds

    await cacheManager.set(key, value, ttl);

    const cachedValue = await cacheManager.get(key);
    expect(cachedValue).toBe(value);

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, ttl * 1000 + 100));

    const expiredValue = await cacheManager.get(key);
    expect(expiredValue).toBeNull();
  });

  test('should store and retrieve data using Redis cache', async () => {
    // console.log(redisClient,"打印模拟的redis")
    const cacheManager = new CacheManager(true, redisClient); // Use Redis cache

    const key = 'redisTestKey';
    const value = 'redisTestValue';
    const ttl = 2; // 2 seconds

    await cacheManager.set(key, value, ttl);

    const cachedValue = await cacheManager.get(key);
    expect(cachedValue).toBe(value);

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, ttl * 1000 + 100));

    const expiredValue = await cacheManager.get(key);
    expect(expiredValue).toBeNull();
  });

  // test('should delete key from cache', async () => {
  //   const cacheManager = new CacheManager(true, redisClient); // Use Redis cache

  //   const key = 'deleteTestKey';
  //   const value = 'deleteTestValue';
  //   const ttl = 10; // 10 seconds

  //   await cacheManager.set(key, value, ttl);

  //   let cachedValue = await cacheManager.get(key);
  //   expect(cachedValue).toBe(value);

  //   await cacheManager.delete(key);
  //   cachedValue = await cacheManager.get(key);
  //   expect(cachedValue).toBeNull();
  // });
});
