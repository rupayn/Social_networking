import { getUserByEmail } from "@/db-red/user.ts";
import { Provider } from "@/generated/prisma/enums.ts";
import { NODE_ENV } from "@/utils/envs.ts";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { generateHashToken, signTokenWithJwt } from "@/utils/oauth.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import { sendMail } from "@/utils/sendMail.ts";

import crypto from "crypto";
import express from "express";
export const signUpController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { name, email, password, phone, city, state, pinCode, country, bio } = req.body;
    const userExists = await getUserByEmail(email);
    if (userExists) {
      return sendJsonResponse(res, 400, { success: false, message: "User already exists" });
    }
    const passwordHash = await generateHashToken(password);
    const username = `${crypto.randomUUID()}`;
    // `${String(email)
    //   .split("@")[0]
    //   ?.toLowerCase()
    //   .replace(/[^a-z0-9]/g, "")
    //   .slice(0, 12)}${crypto.randomBytes(3).toString("hex")}`;
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        phone,
        city,
        emailVerified: false,
        bio: bio ?? `Hello i am ${name}`,
        state,
        pinCode,
        country,
        provider: Provider.MANUAL,
        username,
      },
    });

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
    await prismaClient.session.create({
      data: {
        userId: user.id,
        deviceId,
        refreshToken,
        refreshTokenDateOfExpire: BigInt(today + 7 * 24 * 60 * 60 * 1000),
        active: true,
        userAgent: req.headers["user-agent"],
      },
    });

    const htmlContent =`<div style="
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.7;
  background-color: #f9fafb;
  padding: 24px;
  border-radius: 10px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
">
  
  <p style="font-size: 16px;">
    Dear ${user.name || "User"}, 👋
  </p>

  <p style="font-size: 15px;">
    🎉 We are pleased to inform you that your registration on
    <strong style="color: #2563eb;">Porilekh</strong> has been completed successfully.
  </p>

  <p style="font-size: 15px;">
    💙 Thank you for choosing to join our platform. We truly value your trust
    and look forward to serving you.
  </p>

  <p style="font-size: 15px;">
    🚀 You may now sign in and begin using our services at your convenience.
  </p>

  <p style="font-size: 15px;">
     If you require any assistance, please do not hesitate to contact our
    support team.
  </p>

  <br />

</div>
`;
    sendMail("Welcome to Porilekh", htmlContent, user.email, user.name || "User");
    res.cookie("access_token", accessTokenSigned, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "development" ? false : true, // true in prod
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_date", newRefreshDate, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("device_id", deviceIdToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "development" ? false : true,
    });
    res.cookie("refresh_token", signTokenWithJwt(refreshToken, "7d"), {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password: _, ...userWithoutPassword } = user;
    if ("Session" in userWithoutPassword) delete userWithoutPassword.Session;

    sendJsonResponse(res, 200, {
      success: true,
      message: "User Signup successfully",
      user: userWithoutPassword,
    });
  }
);
