import { redis } from './redis';

export interface RateLimitOptions {
  userId: string;
  maxRequests: number;
  window: number;
  keyString: string;
}

export const rateLimit = async ({
  maxRequests,
  window,
  keyString
}: RateLimitOptions): Promise<number | false> => {
  const key = 'rateLimit:' + keyString;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > maxRequests) {
    const ttl = await redis.ttl(key);

    return ttl;
  }

  return false;
};

export default rateLimit;
