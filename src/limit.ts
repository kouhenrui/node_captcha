// import { RateLimiterRedis } from 'rate-limiter-flexible';
// import Redis from 'ioredis';

// const redisClient = new Redis();

// export class RateLimiter {
//   private limiter: RateLimiterRedis;

//   constructor(points: number, duration: number) {
//     this.limiter = new RateLimiterRedis({
//       storeClient: redisClient,
//       points,
//       duration,
//     });
//   }

//   async consume(key: string): Promise<boolean> {
//     try {
//       await this.limiter.consume(key);
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }
