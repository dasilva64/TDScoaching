import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

let rateLimiter: RateLimiterRedis | null = null;

export async function getRateLimiter(points: number, duration: number, keyPrefix: string) {
  if (rateLimiter) return rateLimiter;

  const redisClient = new Redis(process.env.REDIS_URL as string, {
    enableOfflineQueue: false,
    lazyConnect: true,
  });

  await redisClient.connect();

  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: points,
    duration: duration,
    keyPrefix: keyPrefix,
  });

  return rateLimiter;
}