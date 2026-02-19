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
import express from "express";
import { getCache, setCache } from "@/utils/redisClient.ts";
import {
  REFRESH_KEY,
  USER_ALL_KEY,
  USER_EMAIL_KEY,
  USER_EMAIL_PASS_KEY,
  USER_ID_KEY,
} from "./redis.keys.ts";
import { Provider } from "@/generated/prisma/enums.ts";
import { sendMail } from "@/utils/sendMail.ts";
import { Prisma } from "@/generated/prisma/client.ts";
import { logger } from "@repo/logger/config";

export const getAllUsers = async (): Promise<UserWithSessionsDTO[]> => {
  const cacheKey = USER_ALL_KEY;
  const cached = await getCache<UserWithSessionsDTO[]>(cacheKey);
  if (cached) {
    return cached;
  }
  const user = await prismaClient.user.findMany({
    select: userWithSessionsSelect,
  });
  await setCache(cacheKey, user);
  return user;
};

export const getUserById = async (id: string): Promise<UserDTO | null> => {
  const cacheKey = USER_ID_KEY(id);
  const cached = await getCache<UserDTO>(cacheKey);
  if (cached) {
    return cached;
  }
  const user = await prismaClient.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (user) {
    await setCache(cacheKey, user);
  }
  return user;
};
export const getUserByEmail = async (email: string): Promise<UserDTO | null> => {
  const cacheKey = USER_EMAIL_KEY(email);

  const cached = await getCache<UserDTO>(cacheKey, { extend: true, ttl: 300 });
  if (cached) {
    return cached;
  }
  const user = await prismaClient.user.findUnique({
    where: { email },
    select: userSelect,
  });
  if (user) {
    await setCache(cacheKey, user);
  }
  return user;
};
export const getUserByIdWithPassword = async (id: string): Promise<UserWithPasswordDTO | null> => {
  const cacheKey = `user:id:password:${id}`;

  const cached = await getCache<UserWithPasswordDTO>(cacheKey);
  if (cached) {
    return cached;
  }
  const user = await prismaClient.user.findUnique({
    where: { id },
    select: userWithPasswordSelect,
  });
  if (user) {
    await setCache(cacheKey, user);
  }
  return user;
};
export const getUserByEmailWithPassword = async (
  email: string
): Promise<userFindWithEmailIncludeSessionAndPasswordDTO | null> => {
  const cacheKey = USER_EMAIL_PASS_KEY(email);

  const cached = await getCache<userFindWithEmailIncludeSessionAndPasswordDTO>(cacheKey);
  console.log(`users: `, typeof cached);
  if (cached) return cached;

  const user = await prismaClient.user.findUnique({
    where: { email },
    select: userWithPasswordAndSessionsSelect,
  });
  const safeUser = JSON.parse(
    JSON.stringify(user, (_, value) => (typeof value === "bigint" ? value.toString() : value))
  );
  if (user) {
    await setCache(cacheKey, safeUser);
  }
  return user;
};

export const getUsersCheckValidRefreshToken = async (
  refresh: string
): Promise<SessionWithUserDTO | null> => {
  const cacheKey = REFRESH_KEY(refresh);

  const cached = await getCache<SessionWithUserDTO>(cacheKey, { extend: true, ttl: 960 });

  if (cached) return cached;
  const session = await prismaClient.session.findFirst({
    where: { refreshToken: refresh },
    include: {
      user: {
        select: userSelect,
      },
    },
  });

  if (session) {
    await setCache(cacheKey, session, 960);
  }

  return session;
};

const htmlContent = (name: string, userName: string, provider: string) => `<div style="
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.7;
  background-color: #f9fafb;
  padding: 24px;
  border-radius: 10px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
">
  
  <p style="font-size: 16px;">
    Dear ${name || "User"}, 👋
  </p>

  <p style="font-size: 15px;">
    🎉 We are pleased to inform you that your registration on
    <strong style="color: #2563eb;">Porilekh</strong> has been completed ${provider === "MANUAL" ? "Partially" : "successfully"}. your${provider === "MANUAL" ? " temporary " : ""} username is <strong>${userName}</strong>${provider === "MANUAL" ? "<span style='color:#F5273C; font-weight:600'> ,<br/>Please verify your email address to get full access and a stable user name </span>" : ""}. 
  </p>

  <p style="font-size: 15px;">
    💙 Thank you for choosing to join our platform. We truly value your trust
    and look forward to serving you.
  </p>

  <p style="font-size: 15px;">
    🚀 You may now sign in and begin using our services at your convenience.
  </p>

  <p style="font-size: 15px;">
     If you require any assistance, please do not hesitate to contact our
    support team.
  </p>

  <br />

</div>
`;

export type SignupDataFieldsCommonSignUp = Omit<
  Prisma.UserCreateInput,
  "id" | "createdAt" | "updatedAt" | "Session" | "Profile" | "role"
>;

export const commonSignUp = async function (
  _res: express.Response,
  tx: Prisma.TransactionClient,
  data: SignupDataFieldsCommonSignUp,
) {
  try {
    const existingUser = await tx.user.findUnique({
      where: { email: data.email },
      select: userWithSessionsSelect,
    });
    if (existingUser) {
      return {
        success: existingUser.provider !== Provider.MANUAL,
        message: "User already exists",
        user: existingUser.provider === Provider.MANUAL ? null : existingUser,
      };
    }
    
    const user = await tx.user.create({
      data,
      select: userWithSessionsSelect,
    });

    if (user) {
      await sendMail(
        "Welcome to Porilekh",
        htmlContent(user.name || "User", user.username, user.provider),
        user.email,
        user.name || "User"
      );
      const { Session: _, ...userWithoutSession } = user;
      await setCache(USER_EMAIL_KEY(user.email), userWithoutSession);
    }
    return { success: true, message: "User created", user };
  } catch (error: unknown) {
    logger.error("Error in commonSignUp controller: \n", error);
    return { success: false, message: "Internal server error", user: null };
  }
};
