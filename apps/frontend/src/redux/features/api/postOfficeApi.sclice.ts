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

// export type PostOffice = {
//   Name: string;
//   Block: string;
//   District: string;
//   State: string;
// };

// type ApiResponse = {
//   Status: string;
//   PostOffice: PostOffice[];
// }[];
// https://api.postalpincode.in/pincode/"


/**
 * Represents a Post Office record from data.gov.in
 */
export type PostOffice = {
  officename: string;
  divisionname: string;
  regionname: string;
  circlename: string;
  pincode: string;
  district: string;
  statename: string;
  latitude: string;
  longitude: string;
};

/**
 * API Response from data.gov.in
 */
type ApiResponse = {
  total: number;
  count: number;
  limit: string;
  offset: string;
  records: PostOffice[];
};


export const postOfficeApi = createApi({
  reducerPath: "postOfficeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://api.data.gov.in/resource/`,
  }),
  endpoints: (build) => ({
    getAddressFromPinCode: build.query<PostOffice[], string>({
      query: (pin) => `5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=${
          import.meta.env.VITE_PIN_CODE_API_KEY
        }&format=json&offset=0&filters%5Bpincode%5D=${pin}`,
      transformResponse: (response: ApiResponse) => {
        // if (response[0]?.Status !== "Success" || !response[0]?.PostOffice) {
        //   return [];
        // }
        // return response[0].PostOffice;
        
        if(response.records.length>0)
        return response.records ;
        if(!response.records || response.records.length === 0){
          throw new Error("No post office found for this PIN code");

        }
        return [];
      },
    }),
  }),
});

export const { useGetAddressFromPinCodeQuery } = postOfficeApi;
