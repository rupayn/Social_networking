import { Prisma } from "@/generated/prisma/client.ts";

/**
 * Base user selection (without password)
 */
export const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  avatar: true,
  avatar_id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  phone: true,
  provider: true,
  resume: true,
  resume_id: true,
  profileStatus: true,
  role: true,
} satisfies Prisma.UserSelect;

/**
 * User selection including password
 */
export const userWithPasswordSelect = {
  ...userSelect,
  password: true,
} satisfies Prisma.UserSelect;

/**
 * User selection including sessions
 */
export const userWithSessionsSelect = {
  ...userSelect,
  Session: true,
} satisfies Prisma.UserSelect;


export type UserDTO = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

export type UserWithPasswordDTO = Prisma.UserGetPayload<{
  select: typeof userWithPasswordSelect;
}>;

export type UserWithSessionsDTO = Prisma.UserGetPayload<{
  select: typeof userWithSessionsSelect;
}>;

export type SessionWithUserDTO = Prisma.SessionGetPayload<{
  include: {
    user: {
      select: typeof userSelect;
    };
  };
}> | null;


