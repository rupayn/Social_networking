import { commonSignUp, getUserByEmail, SignupDataFieldsCommonSignUp } from "@/services/user.ts";
import { Provider } from "@/generated/prisma/enums.ts";
import { NODE_ENV } from "@/utils/envs.ts";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { generateHashToken, signTokenWithJwt } from "@/utils/oauth.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import fs from "fs/promises";
import crypto from "crypto";
import express from "express";
import { ApiError } from "@/utils/customError.ts";
import { ProfileSelect } from "@/types/user.types.ts";
import { logger } from "@repo/logger/config";
import { deleteFilesFromCloudinary, uploadToCloudinary } from "@/utils/coudinaryUpload.ts";

type filesType = {
  avatar?: Express.Multer.File[];
  resume?: Express.Multer.File[];
};

export const signUpController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const uploadData = {
      avatarUrl: "",
      avatarPublicId: "",
      resumeUrl: "",
      resumePublicId: "",
    };
    const files = req.files as filesType | undefined;
    const avatar = files?.avatar?.[0] || null;
    const resume = files?.resume?.[0] || null;
    try {
      const { name, email, password, phone, city, state, pinCode, country, bio, ...rest } =
        req.body;


      const userExists = await getUserByEmail(email);
      if (userExists) {
        return sendJsonResponse(res, 400, { success: false, message: "User already exists" });
      }
      const passwordHash = await generateHashToken(password);
      const username = `${crypto.randomUUID()}`;

      if (avatar) {
        const upload = await uploadToCloudinary(avatar.path, {
          folder: "profile",
          resource_type: "image",
          public_id: avatar.filename,
        });
        if (!upload) {
          throw new ApiError(400, "Avatar upload failed");
        }
        uploadData.avatarUrl = upload.url;
        uploadData.avatarPublicId = upload.publicId;
      }
      if (resume) {
        const upload = await uploadToCloudinary(resume.path, {
          folder: "resume",
          
          public_id: resume.filename,
        });
        if (!upload) {
          throw new ApiError(400, "Resume upload failed");
        }
        uploadData.resumeUrl = upload.url;
        uploadData.resumePublicId = upload.publicId;
      }
      const signupTransaction = await prismaClient.$transaction(async (tx) => {
        const data = {
          name,
          email,
          password: passwordHash,
          phone,
          emailVerified: false,
          provider: Provider.MANUAL,
          username,
          avatar: uploadData.avatarUrl,
          avatar_id: uploadData.avatarPublicId,
        } as SignupDataFieldsCommonSignUp;
        const user = await commonSignUp(res, tx, data);

        if (!user.success) throw new ApiError(400, user.message);

        if (!user.user) throw new ApiError(400, user.message);

        const today = Date.now();
        const refreshToken = `${crypto.randomUUID()}`;
        const newRefreshDate = signTokenWithJwt(BigInt(today).toString(), "7d");
        const accessTokenContent = {
          token: user.user.id.toString(),
          access: await generateHashToken(crypto.randomUUID()),
        };
        const deviceId = crypto.randomUUID();
        const deviceIdToken = signTokenWithJwt(deviceId);
        const accessTokenSigned = signTokenWithJwt(JSON.stringify(accessTokenContent), "15m");
        await tx.session.create({
          data: {
            userId: user.user.id,
            deviceId,
            refreshToken,
            refreshTokenDateOfExpire: BigInt(today + 7 * 24 * 60 * 60 * 1000),
            active: true,
            userAgent: req.headers["user-agent"],
          },
        });
        const profileData = {
          userId: user.user.id,
          bio: bio || `Hello I am ${name}. I am new to Porilekh. Nice to meet you all!`,
          github: rest.github || "",
          linkedin: rest.linkedin || "",
          twitter: rest.twitter || "",
          website: rest.website || "",
          resume: uploadData.resumeUrl,
          resume_id: uploadData.resumePublicId,
          headline: "",
          designation: rest.designation || "",
        };

        const profile = await tx.profile.create({
          data: {
            ...profileData,
          },
          select: ProfileSelect,
        });

        const address = await tx.address.create({
          data: {
            city,
            state,
            pinCode,
            country,
            permanentUserId: user.user.id,
          },
        });
        user.user.permanentAddress = address;
        user.user.profile = profile;
        return {
          success: true,
          accessTokenSigned,
          refreshToken,
          newRefreshDate,
          deviceIdToken,
          user: user.user,
        };
      });

      res.cookie("access_token", signupTransaction.accessTokenSigned, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "development" ? false : true, // true in prod
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_date", signupTransaction.newRefreshDate, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("device_id", signupTransaction.deviceIdToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "development" ? false : true,
      });
      res.cookie(
        "refresh_token",
        signTokenWithJwt(signupTransaction.refreshToken as string, "7d"),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: NODE_ENV === "development" ? false : true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }
      );

      const { Session: _, ...userWithoutSession } = signupTransaction.user;

      sendJsonResponse(res, 200, {
        success: true,
        message: "User Signup successfully",
        user: userWithoutSession,
      });
    } catch (error) {
      try {

        if (uploadData.avatarPublicId) {
          await deleteFilesFromCloudinary([uploadData.avatarPublicId]);
        }
        if (uploadData.resumePublicId) {
          await deleteFilesFromCloudinary([uploadData.resumePublicId]);
        }
        if(resume){
          await fs.unlink(resume.path).catch(() => {
            
          });
        }
      } catch (cleanupError) {
        logger.warn("Cloudinary cleanup failed: \n", cleanupError);
      }
      logger.error("Error in signup controller: \n", error);
      sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
    }
  }
);
