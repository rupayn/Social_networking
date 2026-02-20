import { Prisma } from "@/generated/prisma/client.ts";

/**
 * Base Session
 * */

export const sessionSelect = {
  id: true,
  refreshToken: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  active: true,
  deviceId: true,
  refreshTokenDateOfExpire: true,
  userAgent: true,
} satisfies Prisma.SessionSelect;

/*
 * Base Profile
 */

export const ProfileSelect = {
  id: true,
  userId: true,
  resume: true,
  designation: true,
  resume_id: true,
  bio: true,
  headline: true,
  mode: true,
  layout: true,

  linkedin: true,
  github: true,
  twitter: true,
  website: true,

  contacts: true,
  currentAddress: true,
  createdAt: true,
  updatedAt: true,

  educations: true,
  experiences: true,
  skills: true,
};

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
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
  phone: true,
  provider: true,
  permanentAddress: true,
  profile: true,
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

/**
 * User selection including sessions and password
 */

export const userWithPasswordAndSessionsSelect = {
  ...userWithSessionsSelect,
  password: true,
  Session: {
    select: sessionSelect,
  },
} satisfies Prisma.UserSelect;

export type UserDTO = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

export type UserWithPasswordDTO = Prisma.UserGetPayload<{
  select: typeof userWithPasswordSelect;
}>;
export type userFindWithEmailIncludeSessionAndPasswordDTO = Prisma.UserGetPayload<{
  select: typeof userWithPasswordAndSessionsSelect;
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
