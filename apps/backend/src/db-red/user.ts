import { SessionWithUserDTO, UserDTO, userFindWithEmailIncludeSessionAndPasswordDTO, userSelect, userWithPasswordAndSessionsSelect, UserWithPasswordDTO, userWithPasswordSelect, UserWithSessionsDTO, userWithSessionsSelect } from "@/types/user.types.ts";
import { prismaClient } from "@/utils/prismaClient.ts";

export const getAllUsers = async ():Promise<UserWithSessionsDTO[]> => {
  return await prismaClient.user.findMany({
    select: userWithSessionsSelect
  });
};



export const getUserById = async (id: string): Promise<UserDTO | null> => {
  return await prismaClient.user.findUnique({
    where: { id },
    select: userSelect,
  });
};
export const getUserByEmail = async (email: string): Promise<UserDTO | null> => {
  return await prismaClient.user.findUnique({
    where: { email },
    select: userSelect,
  });
};
export const getUserByIdWithPassword = async (id: string):Promise<UserWithPasswordDTO | null> => {
  return await prismaClient.user.findUnique({
    where: { id },
    select: userWithPasswordSelect,
  });
};
export const getUserByEmailWithPassword = async (
  email: string
): Promise<userFindWithEmailIncludeSessionAndPasswordDTO | null> => {
  return await prismaClient.user.findUnique({
    where: { email },
    select: userWithPasswordAndSessionsSelect,
    
  });
};

export const getUsersCheckValidRefreshToken = async (refresh: string):Promise<SessionWithUserDTO |null> => {
  return prismaClient.session.findFirst({
    where: { refreshToken: refresh },
    include: {
      user: {
        select: userSelect,
      },
    },
  });
};
