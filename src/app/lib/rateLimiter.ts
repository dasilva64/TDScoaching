import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { ipAddress } from '@vercel/functions'
import { NextResponse } from 'next/server';

// Instances uniques pour chaque profil
const shortLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

const longLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(100, '60s'),
});

export async function checkRateLimitShort(request: Request, keyPrefix: string) {
  /* const forwardedFor = request.headers.get('x-forwarded-for');
  const ipFromHeader = forwardedFor?.split(',')[0]?.trim();
  const ip = ipFromHeader || (request as any).ip || ipAddress(request) || 'unknown';
  const key = `${keyPrefix}:${ip}`;

  const { success } = await shortLimiter.limit(key);
  if (!success) {
    return NextResponse.json(
      { status: 429, message: "Trop de requêtes (10 max), veuillez réessayer plus tard" },
      { status: 429 }
    );
  }*/
  return null; 
}

export async function checkRateLimitLong(request: Request, keyPrefix: string) {

  /* const forwardedFor = request.headers.get('x-forwarded-for');
  const ipFromHeader = forwardedFor?.split(',')[0]?.trim();
  const ip = ipFromHeader || (request as any).ip || ipAddress(request) || 'unknown';
  const key = `${keyPrefix}:${ip}`;

  const { success } = await longLimiter.limit(key);
  if (!success) {
    return NextResponse.json(
      { status: 429, message: "Trop de requêtes (100 max), veuillez réessayer plus tard" },
      { status: 429 }
    );
  }*/
  return null; 
}
