import { CacheAdapter } from './adapter';
import Redis, { RedisOptions } from 'ioredis';

export class RedisCache implements CacheAdapter {
  private redisClient: Redis;

 
  constructor(redisConfig:RedisOptions){//redisConfig: RedisOptions) {
    // 创建 Redis 客户端
//    this.redisClient=redisConfig
    this.redisClient = new Redis(redisConfig);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
  async exist(key:string):Promise<boolean> {
    const result=await this.redisClient.exists(key)
    console.log(result,"redis缓存")
    if(result)return true
    return false
}
}
