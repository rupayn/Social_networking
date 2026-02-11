/**
 * Cloudinary API slice for Redux Toolkit Query.
 *
 * This slice provides a mutation endpoint to upload files to Cloudinary using the provided cloud name.
 *
 * @remarks
 * - The Cloudinary cloud name is loaded from the environment variable `VITE_CLOUDINARY_CLOUD_NAME`.
 * - Throws an error if the cloud name is missing.
 *
 * @typeParam CloudinaryResponse - The expected response type from Cloudinary after a successful upload.
 * @typeParam FormData - The form data containing the file and upload parameters.
 *
 * @example
 * const [uploadToCloudinary, { data, error, isLoading }] = useUploadToCloudinaryMutation();
 * const formData = new FormData();
 * formData.append('file', file);
 * formData.append('upload_preset', 'your_preset');
 * uploadToCloudinary(formData);
 *
 * @see {@link https://cloudinary.com/documentation/image_upload_api_reference Cloudinary Upload API Reference}
 */
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