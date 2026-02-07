import { Prisma } from "@/generated/prisma/client.ts"
import { prismaClient } from "@/utils/prismaClient.ts"

export const updateUser=function(where:Prisma.UserWhereUniqueInput,data:Prisma.UserUpdateInput){
    return prismaClient.user.update({
        where,
        data
    })
}