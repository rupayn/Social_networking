import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SignResponse } from "./authApi.sclice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/user`,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<SignResponse, void>({
      query: () => ({
        url: "/get-user-details",
      }),

      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = userApi;
