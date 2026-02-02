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
