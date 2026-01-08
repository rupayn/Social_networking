import { asyncHandler } from "../../utils/handler.ts";
import express from "express";
import { generateHashToken, generateRefreshToken, GOOGLE_SCOPES, googleOauth2Client, signAccessToken } from "../../utils/oauth.ts";
import { prismaClient } from "../../utils/prismaClient.ts";
import { google } from "googleapis";
import { Provider } from "../../generated/prisma/enums.ts";

export const signUpController = asyncHandler(
  async (_req: express.Request, res: express.Response) => {
    return res.status(200).json({ message: "Sign-up successful" });
  }
);


// Sign With Google

export const signUpWithGoogleController = asyncHandler(async (_req: express.Request, res: express.Response) => {
  const url = googleOauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: GOOGLE_SCOPES,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
  });
  res.redirect(url);
})  


export const signUpWithGoogleControllerCallback = asyncHandler(async (req: express.Request, res: express.Response) => {
  const code = req.query.code as string;
  if (!code) return res.sendStatus(400);

  const { tokens } = await googleOauth2Client.getToken(code);
  googleOauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: googleOauth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data.email) return res.sendStatus(400).json({ message: "Email not provided by Google" });;

  const user = await prismaClient.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name ?? undefined,
      avatar: data.picture ?? undefined,
      emailVerified: true,
    },
    create: {
      email: data.email,
      emailVerified:true,
      provider: Provider.GOOGLE,
      username: data.email.split("@")[0] as string,
      name: data.name,
      avatar: data.picture,
    },
  });

  const accessToken =  signAccessToken(`${user.id}`);
  const refreshToken =  generateRefreshToken();
  const sessionId=await generateHashToken(refreshToken);
  await prismaClient.session.create({
    data: {
      sessionId,
      userId: user.id,
      accessToken: tokens.access_token ?? accessToken,
      refreshToken: tokens.refresh_token ?? refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    },
  });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in prod
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:3000/dashboard");
});