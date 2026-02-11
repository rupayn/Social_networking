/**
 * Defines the PostOffice type representing the structure of a post office address.
 * 
 * @property Name - The name of the post office.
 * @property Block - The block in which the post office is located.
 * @property District - The district of the post office.
 * @property State - The state of the post office.
 */

/**
 * Represents the API response structure for the post office lookup.
 * 
 * @property Status - The status of the API response (e.g., "Success").
 * @property PostOffice - An array of PostOffice objects returned by the API.
 */

/**
 * RTK Query API slice for fetching post office address details by pin code.
 * 
 * @remarks
 * - Uses `fetchBaseQuery` with the base URL set to the postal pincode API.
 * - Provides a single endpoint `getAddressFromPinCode` to fetch address details.
 * 
 * @example
 * ```tsx
 * const { data, error, isLoading } = useGetAddressFromPinCodeQuery("110001");
 * ```
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type PostOffice = {
  Name: string;
  Block: string;
  District: string;
  State: string;
};

type ApiResponse = {
  Status: string;
  PostOffice: PostOffice[];
}[];

export const postOfficeApi = createApi({
  reducerPath: "postOfficeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.postalpincode.in/pincode/",
  }),
  endpoints: (build) => ({
    getAddressFromPinCode: build.query<PostOffice[], string>({
      query: (pin) => `${pin}`,
      transformResponse: (response: ApiResponse) => {
        if (response[0]?.Status !== "Success" || !response[0]?.PostOffice) {
          return [];
        }
        return response[0].PostOffice;
      },
    }),
  }),
});

export const { useGetAddressFromPinCodeQuery } = postOfficeApi;
