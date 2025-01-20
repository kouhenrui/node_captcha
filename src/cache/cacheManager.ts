import { CacheAdapter} from './adapter';
import { LocalCache } from './localCache';
import { RedisCache } from './redisCache';
import Redis, { RedisOptions } from 'ioredis';



export class CacheManager {
  private adapter: CacheAdapter;
  constructor(useRedis: boolean,redisClient?:RedisOptions ) {//
        if(useRedis){
          // 默认配置
      const redisConfig :RedisOptions= {
        host: redisClient?.host,//'localhost',  // Redis 服务器地址
        port: redisClient?.port,//6379,         // Redis 服务器端口
        db: redisClient?.db||0,//0,              // 使用的数据库（Redis 默认数据库为 0）
        password: redisClient?.password||'',//,       // 如果有密码，添加密码
        username:redisClient?.username||'',
        family: 4,          // IPv4 或 IPv6，4 为 IPv4
        retryStrategy: (times=3) => {
          if (times > 3) {
            return undefined; // 重试次数超过 3 次就不再重试
          }
          return Math.min(times * 50, 2000); // 重试时间间隔指数增加
        },
        maxRetriesPerRequest: 3,  // 每个请求最大重试次数
        connectTimeout: 10000,     // 连接超时，单位 ms
        readOnly: false,           // 是否设置为只读模式
        maxLoadingRetryTime:100,
        // maxClients: 100,           // 最大客户端连接数，避免并发过高时的 Redis 崩溃
        // 以下为连接池设置
        // maxConnections 为连接池中最大的连接数
        // maxConnections: 10,  
        // minConnections: 1, // 最小连接数
      };
            this.adapter = new RedisCache(redisConfig)//new RedisCache(redisConfig); // 使用传入的 Redis 客户端或创建新的
        } else {
            this.adapter = new LocalCache();
        }
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.adapter.set(key, value, ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.adapter.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.adapter.delete(key);
  }

  async exist(key:string):Promise<boolean>{
    return await this.adapter.exist(key)
  }
}
