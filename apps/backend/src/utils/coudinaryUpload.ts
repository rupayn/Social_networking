import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./envs.ts";
import fs from "fs/promises";
import fsSync from "fs";
import { logger } from "@repo/logger/config";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 100000,
});
export { cloudinary };

interface UploadOptions {
  folder?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
  public_id?: string;
}

export const uploadToCloudinary = async (localFilePath: string, options: UploadOptions = {}) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    if (!fsSync.existsSync(localFilePath)) {
      throw new Error("Temp file does not exist: " + localFilePath);
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      public_id: options.public_id,
      folder: options.folder ? `porilekh_uploads/${options.folder}` : "porilekh_uploads",
      resource_type: options.resource_type || "auto",
      type: "upload",
      overwrite: true,
    });

    // Remove temp file after upload
    await fs.unlink(localFilePath).catch((e) => {
      logger.warn("Temp cleanup failed:", e);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    // Remove file if upload fails

    logger.error("Error in uploadToCloudinary: \n", error instanceof Error ? error.cause : error);
    await fs.unlink(localFilePath).catch((e) => {
      logger.warn("Temp cleanup failed:", e);
    });
    console.log(error);
    throw error;
  }
};

export const deleteFilesFromCloudinary = async (public_ids: string[]) => {
  try {
    for (const publicId of public_ids) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    logger.error("Error in deleteFilesFromCloudinary: \n", error);
    throw error;
  }
};
