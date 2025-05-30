import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

let rateLimiter: RateLimiterRedis | null = null;

export async function getRateLimiter() {
  if (rateLimiter) return rateLimiter;

  const redisClient = new Redis({
    enableOfflineQueue: false,
    lazyConnect: true,
  });

  await redisClient.connect(); // attend que Redis soit prêt

  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 1,
    duration: 60,
    keyPrefix: 'rlflx-contact',
  });

  return rateLimiter;
}