import "dotenv/config"
import { createClient, RedisClientType } from "redis";
import { NODE_ENV, REDIS_URL } from "./envs.ts";

const globalForRedis=global as unknown as {redis?: RedisClientType};
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
export { redisClient };
