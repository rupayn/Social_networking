import "dotenv/config";
import { createClient, RedisClientType } from "redis";
import { NODE_ENV, REDIS_URL } from "./envs.ts";

const globalForRedis = global as unknown as { redis?: RedisClientType };
const redisClient =
  globalForRedis.redis ??
  createClient({
    url: REDIS_URL,
  });

redisClient.on("error", (err: Error) => {
  console.error("Redis Client Error", err);
});

if (NODE_ENV === "development") {
  globalForRedis.redis = redisClient;
}

if (!redisClient.isOpen) {
  await redisClient.connect();
}

/**
 * Retrieves data from Redis cache for a given key.
 * @param {string} key - key to retrieve data from Redis cache
 * @returns {Promise<T|null>} - data retrieved from Redis cache or null if key does not exist
 */
const getCache = async <T>(
  key: string,
  extend?: { extend: boolean; ttl: number }
): Promise<T | null> => {
  const data = await redisClient.get(key);
  if (!data) {
    return null;
  }
  if (data && extend && extend.extend) {
    redisClient.expire(key, extend.ttl);
  }
  return JSON.parse(data) as T;
};

const setCache = async (key: string, data: unknown, ttl = 300): Promise<void> => {
  await redisClient.set(key, JSON.stringify(data), { EX: ttl });
};

export { redisClient, setCache, getCache };
