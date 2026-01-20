import { v2 as cloudinary } from "cloudinary";

export const getBase64 = (file: Express.Multer.File) =>`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
export const uploadFilesToCloudinary = async (files: any[] = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),

        {
          resource_type: "auto",
          public_id: crypto.randomUUID(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result: any) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err: any) {
    throw new Error("Error uploading files to cloudinary", err);
  }
};

export const deleteFilesFromCloudinary = async (public_id: any[]) => {};
