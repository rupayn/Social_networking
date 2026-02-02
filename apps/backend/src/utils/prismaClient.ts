import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL! as string,
});
const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prismaClient;

export { prismaClient };

