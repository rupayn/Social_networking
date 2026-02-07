import {
  SessionWithUserDTO,
  UserDTO,
  userFindWithEmailIncludeSessionAndPasswordDTO,
  userSelect,
  userWithPasswordAndSessionsSelect,
  UserWithPasswordDTO,
  userWithPasswordSelect,
  UserWithSessionsDTO,
  userWithSessionsSelect,
} from "@/types/user.types.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import { getCache, setCache } from "@/utils/redisClient.ts";

const USER_ID_KEY = (id: string) => `user:id:${id}`;
const USER_EMAIL_KEY = (email: string) => `user:email:${email}`;
const USER_ALL_KEY = `user:all`;
const REFRESH_KEY = (token: string) => `session:refresh:${token}`;



export const getAllUsers = async (): Promise<UserWithSessionsDTO[]> => {
  const cacheKey=USER_ALL_KEY;
  const cached = await getCache<UserWithSessionsDTO[]>(cacheKey);
  if(cached){
    return cached;
  }
  const user= await prismaClient.user.findMany({
    select: userWithSessionsSelect,
  });
  await setCache(cacheKey,user)
  return user;
};

export const getUserById = async (id: string): Promise<UserDTO | null> => {
   const cacheKey = USER_ID_KEY(id);
  const cached = await getCache<UserDTO>(cacheKey);
  if (cached) {
    return cached;
  }
  const user= await prismaClient.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if(user){
    await setCache(cacheKey,user)
  }
  return user;
};
export const getUserByEmail = async (email: string): Promise<UserDTO | null> => {
  const cacheKey = USER_EMAIL_KEY(email);

  const cached = await getCache<UserDTO>(cacheKey);
  if (cached) {
    return cached;
  }
  const user= await prismaClient.user.findUnique({
    where: { email },
    select: userSelect,
  });
  if(user){
    await setCache(cacheKey, user)
  }
  return user;
};
export const getUserByIdWithPassword = async (id: string): Promise<UserWithPasswordDTO | null> => {
   const cacheKey = `user:id:password:${id}`;

  const cached = await getCache<UserWithPasswordDTO>(cacheKey);
  if (cached) {
    return cached;
  }
  const user= await prismaClient.user.findUnique({
    where: { id },
    select: userWithPasswordSelect,
  });
  if(user){
    await setCache(cacheKey, user)
  }
  return user;
};
export const getUserByEmailWithPassword = async (
  email: string
): Promise<userFindWithEmailIncludeSessionAndPasswordDTO | null> => {
  const cacheKey = `user:email:password:${email}`;

  const cached =
    await getCache<userFindWithEmailIncludeSessionAndPasswordDTO>(cacheKey);
    if (cached) return cached;

  const user= await prismaClient.user.findUnique({
    where: { email },
    select: userWithPasswordAndSessionsSelect,
  });
  if(user){
    await setCache(cacheKey, user)
  }
  return user;
};

export const getUsersCheckValidRefreshToken = async (
  refresh: string
): Promise<SessionWithUserDTO | null> => {
  const cacheKey = REFRESH_KEY(refresh);

  const cached = await getCache<SessionWithUserDTO>(cacheKey);

  if (cached) return cached;
  const session = prismaClient.session.findFirst({
    where: { refreshToken: refresh },
    include: {
      user: {
        select: userSelect,
      },
    },
  });

  if (session) {
    await setCache(cacheKey, session);
  }

  return session;
};
