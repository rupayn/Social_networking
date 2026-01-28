import { beforeEach } from "node:test";
import { PrismaClient } from "@/generated/prisma/client.ts";
import { mockReset, mockDeep } from "vitest-mock-extended";
beforeEach(() => {
  mockReset(prismaClient);
});
export const prismaClient = mockDeep<PrismaClient>();
