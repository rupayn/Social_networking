const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";



export const cloudinaryApi= createApi({
  reducerPath: "cloudinaryApi",
  baseQuery:fetchBaseQuery({
    baseUrl:`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/`,
  }),
  endpoints:(builder)=>({
    uploadToCloudinary:builder.mutation<unknown,FormData>({
      query:(formData)=>({
        url:`auto/upload`,
        body:formData,
        method:"POST",
      })
    })
  })
})

