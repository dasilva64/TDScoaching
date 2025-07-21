import Redis from 'ioredis';
import { NextResponse } from 'next/server';
import { RateLimiterRedis } from 'rate-limiter-flexible';

let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL as string, {
      enableOfflineQueue: false,
      lazyConnect: true,
    });
  }

  return redisClient;
}

export function createRateLimiter(points: number, duration: number, keyPrefix: string) {
  const redisClient = getRedisClient();

  return new RateLimiterRedis({
    storeClient: redisClient,
    points,
    duration,
    keyPrefix,
  });
}

export async function checkRateLimit(request: Request, options: {
  points: number;
  duration: number;
  keyPrefix: string;
}) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  const rateLimiter = await createRateLimiter(options.points, options.duration, options.keyPrefix);
const key = `${options.keyPrefix}-${ip}`;
  try {
    await rateLimiter.consume(key);
    return null;
  } catch (error) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
}
