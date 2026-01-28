import { asyncHandler, sendJsonResponse } from "../../utils/handler.ts";
import express from "express";

import bcrypt from "bcrypt";
import { Provider } from "@/generated/prisma/enums.ts";
import { getUserByEmailWithPassword } from "@/db-red/user.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import { generateHashToken, signTokenWithJwt } from "@/utils/oauth.ts";

export const signinController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = await getUserByEmailWithPassword(email);
    if (!user) {
      return sendJsonResponse(res, 404, { success: false, message: "User not found" });
    }

    if (user.provider !== Provider.MANUAL)
      return res.status(400).json({
        message: `Please sign in using ${user.provider} you did not registered email and password`,
      });
    const checkPassword = await bcrypt.compare(password, `${user.password}`);
    if (!checkPassword) {
      return sendJsonResponse(res, 401, { success: false, message: "Invalid credentials" });
    }
    const today = Date.now();
    const refreshToken = `${crypto.randomUUID()}`;
    const newRefreshDate = signTokenWithJwt(BigInt(today).toString(), "7d");
    const accessTokenContent = {
      token: user.id.toString(),
      access: await generateHashToken(crypto.randomUUID()),
    };
    const deviceId = crypto.randomUUID();
    const deviceIdToken = signTokenWithJwt(deviceId);
    const accessTokenSigned = signTokenWithJwt(JSON.stringify(accessTokenContent), "15m");

    await prismaClient.session.upsert({
      where: { userId: user.id },
      update: {
        refreshToken,
        refreshTokenDateOfExpire: BigInt(today + 7 * 24 * 60 * 60 * 1000),
        deviceId,
        userAgent: req.headers["user-agent"],
        active: true,
      },
      create: {
        userId: user.id,
        refreshToken: refreshToken,
        refreshTokenDateOfExpire: BigInt(today + 7 * 24 * 60 * 60 * 1000),
        deviceId,
        userAgent: req.headers["user-agent"],
        active: true,
      },
    });
    res.cookie("access_token", accessTokenSigned, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true, // true in prod
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_date", newRefreshDate, {
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
    res.cookie("refresh_token", signTokenWithJwt(refreshToken, "7d"), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password: _, Session: _ses, ...restUser } = user;
    return sendJsonResponse(res, 200, {
      success: true,
      message: "Sign-in successful",
      user: restUser,
    });
  }
);
