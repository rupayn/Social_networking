import { Prisma } from "@/generated/prisma/client.ts";
import { userWithPasswordSelect } from "@/types/user.types.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import { clearCache, setCache } from "@/utils/redisClient.ts";
import { USER_EMAIL_PASS_KEY } from "./redis.keys.ts";

export const updateUser = async function (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
) {
  const user = await prismaClient.user.update({
    where,
    data,
    select: userWithPasswordSelect,
  });
  const cacheKey = USER_EMAIL_PASS_KEY(user.email);
  await clearCache(cacheKey);
  await setCache(cacheKey, user);
  return user;
};
