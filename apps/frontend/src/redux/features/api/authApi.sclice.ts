import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SignInRequest {
  email: string;
  password: string;
}
type Provider = "GOOGLE" | "MANUAL";
type Role = "RECRUITER" | "CANDIDATE";
type ProfileStatus = "active" | "suspended" | "deactivated";
interface user{
    id: string;
    email: string;
    emailVerified: boolean;
    provider: Provider;
    username: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    phone: string | null;
    avatar: string | null;
    avatar_id: string | null;
    resume: string | null;
    resume_id: string | null;
    profileStatus: ProfileStatus;
    city: string | null;
    dist: string | null;
    state: string | null;
    country: string | null;
    pinCode: string | null;
    bio: string | null;
    linkedin: string | null;
    github: string | null;
    twitter: string | null;
    website: string | null;
}
interface SignInResponse {
  success: boolean;
  message: string;
  user:user
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

    signIn: builder.mutation<SignInResponse,SignInRequest> ({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // forgot password endpoint
    forgotPassword: builder.mutation <
      ForgotPasswordResponse,
      ForgotPasswordRequest > ({
      query: (body) => ({
        url: "/forgot-password-send-link",
        method: "POST",
        body,
      }),
    }),
    // reset password endpoint
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

  }),
});

export const { useSignInMutation,useForgotPasswordMutation,useResetPasswordMutation}=authApi