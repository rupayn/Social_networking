import { Prisma } from "@/generated/prisma/client.ts"
import { userWithPasswordSelect } from "@/types/user.types.ts"
import { prismaClient } from "@/utils/prismaClient.ts"
import { setCache } from "@/utils/redisClient.ts"

export const updateUser=async function(where:Prisma.UserWhereUniqueInput,data:Prisma.UserUpdateInput){
    const user=await  prismaClient.user.update({
        where,
        data,
        select:userWithPasswordSelect
    })
    const cacheKey = `user:email:password:${user.email}`;
    await setCache(cacheKey, user)
    return user
}