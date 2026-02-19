/**
 * Authentication API slice for managing auth-related requests.
 *
 * @remarks
 * This API slice provides endpoints for user authentication operations including
 * sign in, password recovery, and password reset functionality.
 *
 * @tagTypes Auth - Cache invalidation tag for authentication-related data
 *
 * @endpoints
 * - `signIn` - Authenticates a user with credentials
 * - `forgotPassword` - Initiates password recovery by sending reset link
 * - `resetPassword` - Completes password reset with new password
 */
/**
 * Authentication API slice using Redux Toolkit Query
 *
 * This API slice handles all authentication-related HTTP requests to the backend.
 * It provides mutations for user sign-in, password recovery, and password reset operations.
 *
 * @constant authApi - Redux Toolkit Query API instance
 *
 * @property {string} reducerPath - Redux store path where auth API state is stored ("authApi")
 * @property {FetchBaseQueryConfig} baseQuery - Configures base URL for all auth endpoints
 * @property {string[]} tagTypes - Defines cache invalidation tags (["Auth"])
 *
 * @example
 * // Usage in a React component
 * const [signIn, { isLoading }] = useSignInMutation();
 *
 * Endpoints:
 *
 * @endpoint signIn
 * POST /auth/signin
 * Authenticates a user with credentials
 * @param {SignInRequest} body - User credentials (email/username and password)
 * @returns {Promise<SignInResponse>} - User data and authentication tokens
 * @invalidates Auth tag - Clears cached Auth data after successful sign-in
 *
 * @endpoint forgotPassword
 * POST /auth/forgot-password-send-link
 * Initiates password reset by sending reset link to user's email
 * @param {ForgotPasswordRequest} body - User's email address
 * @returns {Promise<ForgotPasswordResponse>} - Confirmation message
 *
 * @endpoint resetPassword
 * POST /auth/reset-password
 * Completes password reset with new password and reset token
 * @param {ResetPasswordRequest} body - Reset token and new password
 * @returns {Promise<ResetPasswordResponse>} - Success confirmation
 * @invalidates Auth tag - Clears cached Auth data after password reset
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SignInRequest {
  email: string;
  password: string;
}

// interface SignupRequest {
//   email: string;
//   name: string;
//   password: string;
//   phone: string;
//   bio: string;
//   linkedin: string | undefined | null;
//   github: string | undefined | null;
//   website: string | undefined | null;
//   twitter: string | undefined | null;
//   avatar: File | null;
//   resume: File | null;
//   pinCode: string;
//   dist: string;
//   city: string;
//   state: string;
//   country: string;
// }

type Provider = "GOOGLE" | "MANUAL";
type Role = "RECRUITER" | "CANDIDATE";
type ProfileStatus = "active" | "suspended" | "deactivated";

interface PermanentAddress {
  id: string;
  permanentUserId: string;
  currentProfileId: string | null;
  city: string;
  district: string | null;
  state: string;
  country: string;
  pinCode: string;
}

interface Profile {
  id: string;
  userId: string;
  resume: string | null;
  resume_id: string | null;
  designation: string;
  headline: string;
  bio: string;
  mode: "light" | "dark";
  layout: "default" | string;

  linkedin: string;
  github: string;
  twitter: string;
  website: string;

  createdAt: string;
  updatedAt: string;
}



interface user {
  id: string;
  email: string;
  username: string;
  name: string | null;

  avatar: string | null;
  avatar_id: string | null;

  emailVerified: boolean;
  emailVerifiedAt: string | null;

  createdAt: string;
  updatedAt: string;

  phone: string | null;

  provider: Provider;
  role: Role;
  profileStatus: ProfileStatus;

  permanentAddress: PermanentAddress;
  profile: Profile;
}


interface SignResponse {
  success: boolean;
  message: string;
  user: user;
}


interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordRequest {
  password: string;
  token: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}





export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/auth`,
  }),
  tagTypes: ["Auth"],

  endpoints: (builder) => ({
    signUp: builder.mutation<SignResponse, FormData>({
      
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"]
    }),

    signIn: builder.mutation<SignResponse, SignInRequest>({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // forgot password endpoint
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/forgot-password-send-link",
        method: "POST",
        body,
      }),
    }),
    // reset password endpoint
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useSignInMutation, useForgotPasswordMutation, useResetPasswordMutation,useSignUpMutation } = authApi;
