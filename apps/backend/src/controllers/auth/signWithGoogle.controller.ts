import "dotenv/config";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import express from "express";
import crypto from "crypto";
import {
  generateHashToken,
  GOOGLE_SCOPES,
  googleOauth2Client,
  signTokenWithJwt,
} from "@/utils/oauth.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import { google } from "googleapis";
import { Provider } from "@/generated/prisma/enums.ts";
// import { userSelect } from "@/types/user.types.ts";
import { FRONTEND_URL, NODE_ENV } from "@/utils/envs.ts";

import { commonSignUp } from "@/services/user.ts";
import { logger } from "@repo/logger/config";

// Sign With Google

export const signUpWithGoogleController = asyncHandler(
  async (_req: express.Request, res: express.Response) => {
    const url = googleOauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: GOOGLE_SCOPES,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      // Include the state parameter to reduce the risk of CSRF attacks.
    });
    res.redirect(url);
  }
);

export const signWithGoogleControllerCallback = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const code = req.query.code as string;
    if (!code) return res.sendStatus(400);

    const { tokens } = await googleOauth2Client.getToken(code);
    googleOauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: googleOauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) return sendJsonResponse(res, 400, { message: "Email not provided by Google" });
    const username = `${String(data.email)
      .split("@")[0]
      ?.toLowerCase()}${crypto.randomBytes(6).toString("hex")}`;

    const name= data.name ?? "User";


    const signupTransaction = await prismaClient.$transaction(async (tx) => {
      const user = await commonSignUp(res,tx, {
        username,
        email: data.email as string,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        name,
        avatar: data.picture ?? undefined,
        provider: Provider.GOOGLE,
      });
      if (!user.success && user.user === null)
        return { success: false, message: user.message, accessToken: null };
      if (user.user === null) return { success: false, message: user.message, accessToken: null };
      // res.sendStatus(400).json({ message: user.message });
      const accessTokenContent = {
        token: user.user.id.toString(),
        access: await generateHashToken(crypto.randomUUID()),
      };

      const accessToken = signTokenWithJwt(JSON.stringify(accessTokenContent), "15m");
      const refreshToken = `${crypto.randomUUID()}`;
      const today = Date.now();
      const deviceId = crypto.randomUUID(); // unique device id to identify device
      const deviceIdToken = signTokenWithJwt(deviceId); // to verify device id later if needed it will store in client side
      const refresh_date = signTokenWithJwt(today.toString(), "7d");
      await tx.profile.upsert({
        where:{userId:user.user.id},
        update:{},
        create:{
          userId:user.user.id,
          bio: `Hello I am ${name} , I am new to Porilekh. Nice to meet you all!`,
          github: "",
          linkedin: "",
          twitter: "",
          website: "",
          resume:"",
          resume_id:"",
          headline:""
        }

      })
      await tx.session.upsert({
        where: { userId: user.user.id },
        update: {
          deviceId: deviceId,
          refreshToken: refreshToken,
          refreshTokenDateOfExpire: BigInt(today + 7 * 24 * 60 * 60 * 1000),
          userAgent: req.headers["user-agent"],
          active: true,
        },
        create: {
          userId: user.user.id,
          refreshToken: refreshToken,
          userAgent: req.headers["user-agent"],
          deviceId,
          refreshTokenDateOfExpire: BigInt(today + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return {
        success: true,
        accessToken,
        refreshToken,
        refresh_date,
        deviceIdToken,
        user: user.user,
      };
    });

    if(!signupTransaction.success) return res.sendStatus(400).json({ message: signupTransaction.message });

    res.cookie("access_token", signupTransaction.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "development" ? false : true, // true in prod
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_date", signupTransaction.refresh_date, {
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
    res.cookie("refresh_token", signTokenWithJwt(signupTransaction.refreshToken as string, "7d"), {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(FRONTEND_URL);
    } catch (error) {
      logger.error("Error in Google Sign-In callback:", error);
      return res.status(500).send( "<div style='color:red'>Internal Server Error</div>" );
    }
  }
);





























    // await prismaClient.user.upsert({
    //   where: { email: data.email },
    //   update: {
    //     name: data.name ?? undefined,
    //     avatar: data.picture ?? undefined,
    //     emailVerified: true,
    //   },
    //   create: {
    //     email: data.email,
    //     emailVerified: true,
    //     provider: Provider.GOOGLE,
    //     username,
    //     bio: `Hello i am ${data.name}`,
    //     name: data.name,
    //     avatar: data.picture,
    //   },
    //   select: {
    //     ...userSelect,
    //     Session: true,
    //   },
    // });
