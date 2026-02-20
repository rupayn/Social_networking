import { validate } from "@/middleware/vaildate.ts";
import { signUpZodSchema } from "@repo/zod-schemas/config";
import { logger } from "@repo/logger/config";
import { Router } from "express";
import express from "express";
import { singleUploadDpAndCv } from "@/middleware/multer.ts";
import { uploadToCloudinary } from "@/utils/coudinaryUpload.ts";
import { asyncHandler } from "@/utils/handler.ts";
import fs from "fs/promises";

const check = Router();

type filesType = {
  avatar?: Express.Multer.File[];
  resume?: Express.Multer.File[];
};

check.route("/").post((_req: express.Request, res: express.Response) => {
  res.send("Hii / ");
});
check.route("/upload").post(
  singleUploadDpAndCv,
  validate(signUpZodSchema),
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const files = req.files as filesType;
    console.log(files.resume?.[0]);
    const avatar = files?.avatar?.[0];
    const resume = files?.resume?.[0];
    try {
      let result;
      let pdf;
      if (avatar) {
        console.log(avatar);
        result = await uploadToCloudinary(avatar.path, {
          folder: "profile",
          resource_type: "image",
          public_id: avatar.filename,
        });
      }

      if (resume) {
        pdf = await uploadToCloudinary(resume.path, {
          folder: "resume",
          resource_type: "auto",
          public_id: resume.filename,
        });
      }

      res.status(200).json({
        message: "success",
        result,
        pdf,
      });
    } catch (error) {
      logger.error("Error in uploadToCloudinary check route : \n", error);
      if (avatar) {
        await fs.unlink(avatar.path).catch(() => {});
      }
      if (resume) {
        await fs.unlink(resume.path).catch(() => {});
      }
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
check.route("/olo").get((req: express.Request, res: express.Response) => {
  res.status(200).json({
    message: "olo",
    id: req.ip,
  });

  logger.info(`Hii aoi ${req.ip}`);
});

export default check;
