const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type CloudinaryResponse = {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
};

if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error("Cloudinary cloud name is missing");
}

export const cloudinaryApi= createApi({
  reducerPath: "cloudinaryApi",
  baseQuery:fetchBaseQuery({
    baseUrl:`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/`,
  }),
  endpoints:(builder)=>({
    uploadToCloudinary:builder.mutation<CloudinaryResponse,FormData>({
      query:(formData)=>({
        url:`auto/upload`,
        method:"POST",
        body:formData,
      })
    }),
  })
})

export const {
  useUploadToCloudinaryMutation
} = cloudinaryApi;