import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { NODE_ENV } from "./envs.ts";
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

if (NODE_ENV === "development") globalForPrisma.prisma = prismaClient;

export { prismaClient };