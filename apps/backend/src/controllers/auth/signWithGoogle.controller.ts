import "dotenv/config";
import { asyncHandler } from "../../utils/handler.ts";
import express from "express";
import {
  generateHashToken,
  
  GOOGLE_SCOPES,
  googleOauth2Client,
  signTokenWithJwt,
} from "../../utils/oauth.ts";
import { prismaClient } from "../../utils/prismaClient.ts";
import { google } from "googleapis";
import { Provider } from "../../generated/prisma/enums.ts";
import { userSelect } from "../../types/user.types.ts";

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
    const code = req.query.code as string;
    if (!code) return res.sendStatus(400);

    const { tokens } = await googleOauth2Client.getToken(code);
    googleOauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: googleOauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) return res.sendStatus(400).json({ message: "Email not provided by Google" });

    const user = await prismaClient.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name ?? undefined,
        avatar: data.picture ?? undefined,
        emailVerified: true,
      },
      create: {
        email: data.email,
        emailVerified: true,
        provider: Provider.GOOGLE,
        username: data.email.split("@")[0] as string,
        name: data.name,
        avatar: data.picture,
      },
      select: {
        ...userSelect,
        Session: true,
      },
    });

    const accessTokenContent = {
      token: user.id.toString(),
      access: await generateHashToken(crypto.randomUUID()),
    };

    const accessToken = signTokenWithJwt(JSON.stringify(accessTokenContent),"15m");
    const refreshToken = `${crypto.randomUUID()}`;

    const deviceId = crypto.randomUUID(); // unique device id to identify device
    const deviceIdToken = signTokenWithJwt(deviceId); // to verify device id later if needed it will store in client side
    const refresh_date = signTokenWithJwt(Date.now().toString(),"7d");
    await prismaClient.session.upsert({
      where: { userId: user.id },
      update: {
        deviceId: deviceId,
        refreshToken: refreshToken,
        refreshTokenDateOfExpire: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers["user-agent"],
        active: true,
      },
      create: {
        userId: user.id,
        refreshToken: refreshToken,
        userAgent: req.headers["user-agent"],
        deviceId,
        refreshTokenDateOfExpire: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true, // true in prod
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_date", refresh_date, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("device_id", deviceIdToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
    });
    res.cookie("refresh_token", signTokenWithJwt(refreshToken,"7d"), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/");
  }
);
