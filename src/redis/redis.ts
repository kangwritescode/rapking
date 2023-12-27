import Redis from 'ioredis';
import { env } from 'src/env.mjs';

export const redis = new Redis(env.REDIS_CONNECTION_STRING);
