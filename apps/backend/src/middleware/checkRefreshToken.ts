import express from "express";
import { asyncHandler } from "@/utils/handler.ts";
import {
  generateHashToken,
  signTokenWithJwt,
  decodeTokenWithJwt,
} from "@/utils/oauth.ts";
import { getUsersCheckValidRefreshToken } from "@/db-red/user.ts";
import { prismaClient } from "@/utils/prismaClient.ts";

interface AccessTokenSubject {
  token: string;
  access: string;
}


export const checkTokens = asyncHandler(
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const refreshTokenDate = req.cookies["refresh_date"];
    const accessToken = req.cookies["access_token"];
    if(accessToken){
      const decodedAccessToken = decodeTokenWithJwt(accessToken).sub;
      if (!decodedAccessToken) {
        return res.status(401).json({
          message: "Invalid access token",
        });
      }
      if(typeof decodedAccessToken === "string"){
        const decodedAccess=JSON.parse(decodedAccessToken);
        const userId=decodedAccess.token;
        res.locals.userIdFromMiddleWare=userId
        return next();
      }
      if(typeof decodedAccessToken === "object"){
        const decodedAccess=decodedAccessToken as AccessTokenSubject;
        const userId=decodedAccess.token;
        res.locals.userIdFromMiddleWare=userId
        return next();
      }
    }
    const refreshToken = req.cookies["refresh_token"];
    
    // if no refresh token or date, unauthorized
    
    if (!refreshToken) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    if (!refreshTokenDate) {
      return res.status(401).json({
        message: "Refresh token date missing",
      });
    }
    const decodedDate = decodeTokenWithJwt(refreshTokenDate).sub;

    if (!decodedDate) {
      return res.status(401).json({
        message: "Invalid refresh token date",
      });
    }
    const decodedRefreshToken = decodeTokenWithJwt(refreshToken).sub;
    if (!decodedRefreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    //  If new login happened after the refresh token was issued

    const deviceId = req.cookies["device_id"];
    if (!deviceId) {
      return res.status(401).json({
        message: "Device ID missing",
      });
    }
    const decodedDeviceId = decodeTokenWithJwt(deviceId).sub;
    if (!decodedDeviceId) {
      return res.status(401).json({
        message: "Invalid device ID",
      });
    }

    const session = await getUsersCheckValidRefreshToken(decodedRefreshToken.toString());
    if (!session) {
      
      return res.status(401).json({
        session,
        decodedRefreshToken,
        message: "Refresh token not recognized",
      });
    }
    if (session.deviceId.toString() !== decodedDeviceId.toString()) {
      return res.status(401).json({ message: "Invalid device ID, need to re-login" });
    }
    if (session.refreshToken.toString() !== decodedRefreshToken.toString()) {
      return res.status(401).json({ message: "Refresh token mismatch, need to re-login" });
    }
    const today = Date.now();
    if (BigInt(decodedDate.toString()) >= BigInt(session.refreshTokenDateOfExpire.toString())) {
      return res.status(401).json({ message: "Refresh token date mismatch, need to re-login" });
    }

    if (BigInt(today) < BigInt(decodedDate.toString())) {
      return res.status(401).json({
        message: "Refresh token expired, please login again",
      });
    }

    if (BigInt(session.refreshTokenDateOfExpire.toString()) < today) {
      return res.status(401).json({
        message: "Session expired, please login again",
      });
    }

    if (
      BigInt(session.refreshTokenDateOfExpire.toString()) - BigInt(today) <
      2n * 24n * 60n * 60n * 1000n
    ) {
      const refreshToken = `${crypto.randomUUID()}`;
      const newRefreshDate = signTokenWithJwt(today.toString(),"7d");
      const accessTokenContent = {
        token: session.user.id.toString(),
        access: await generateHashToken(crypto.randomUUID()),
      };
      const accessTokenSigned = signTokenWithJwt(JSON.stringify(accessTokenContent),"15m");
      await prismaClient.session.update({
        where: { id: session.id },
        data: {
          refreshToken,
          refreshTokenDateOfExpire: today + 7 * 24 * 60 * 60 * 1000,
        },
      });

      res.cookie("access_token", accessTokenSigned, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "development" ? false : true, // true in prod
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", signTokenWithJwt(refreshToken,"7d"), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refresh_date", newRefreshDate, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    if (!accessToken) {
      const accessTokenContent = {
        token: session.user.id.toString(),
        access: await generateHashToken(crypto.randomUUID()),
      };
      const accessTokenSigned = signTokenWithJwt(JSON.stringify(accessTokenContent), "15m");
      res.cookie("access_token", accessTokenSigned, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "development" ? false : true, // true in prod
        maxAge: 15 * 60 * 1000,
      });
    }
    res.locals.userFromMiddleware = session.user;
    res.locals.sessionFromMiddleware = session;
    next();
  }
);
