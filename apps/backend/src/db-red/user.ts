import { SessionWithUserDTO, UserDTO, userSelect, UserWithPasswordDTO, userWithPasswordSelect, UserWithSessionsDTO, userWithSessionsSelect } from "../types/user.types.ts";
import { prismaClient } from "../utils/prismaClient.ts";

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
export const getUserByIdWithPassword = async (id: string):Promise<UserWithPasswordDTO | null> => {
  return await prismaClient.user.findUnique({
    where: { id },
    select: userWithPasswordSelect,
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
