import "dotenv/config"
import { createClient, RedisClientType } from "redis";

const globalForRedis=global as unknown as {redis?: RedisClientType};
const redisClient =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL! ,
  });

redisClient.on("error", (err: Error) => {
  console.error("Redis Client Error", err);
});

if (process.env.NODE_ENV === "development") {
  globalForRedis.redis = redisClient;
}

if (!redisClient.isOpen) {
  await redisClient.connect();
}
export { redisClient };
