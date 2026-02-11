import express from "express";

import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { sendMail } from "@/utils/sendMail.ts";
import { logger } from "@repo/logger/config";
import { decodeTokenWithJwt, generateHashToken, signTokenWithJwt, verifyHashedToken } from "@/utils/oauth.ts";
import { generateActionEmailTemplate } from "@/utils/actionTempletHtml.ts";
import { redisClient } from "@/utils/redisClient.ts";
import { getUserByEmail, getUserByIdWithPassword } from "@/services/user.ts";
import { BACKEND_URL, FRONTEND_URL } from "@/utils/envs.ts";
import { validateResetPasswordTokenZodSchema } from "@repo/zod-schemas/config";
import { updateUser } from "@/services/updateUser.ts";

export const forgotPasswordSendLink = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return sendJsonResponse(res, 400, { success: false, message: "User not found" });
    }

    const token = signTokenWithJwt(user.id, "15m");
    const code = crypto.randomUUID();
    await redisClient.set(`${user.id}-reset-password-code`, `${code}`, { EX: 15 * 60 });
    const params = new URLSearchParams({
      token,
      code,
    });

    const url = `${BACKEND_URL}/auth/validate-reset-password-token?${params.toString()}`;

    const htmlContent = generateActionEmailTemplate({
      title: "Password Reset Request",
      greetingName: user.name?.split(" ")[0] || user.username,
      message:
        "We received a request to reset the password associated with your account in  <span style='font-weight: 600;color:`#FF1493`'> Porilekh </span>. Please use the button below to proceed.",
      actionText: "Reset Password",
      actionLink: url,
      footerNote:
        "This link will remain valid for 15 minutes. <span  style='font-weight: 600;color:`red`'>If you did not request a password reset, please ignore this email.</span>",
    });
    await sendMail("Password Reset", htmlContent, email,user.name as string);
    return sendJsonResponse(res, 200, {
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error: unknown) {
    logger.error("Error in forgotPassword controller: \n", error);
    return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
  }
});

export const validateResetPasswordToken = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const token =
  typeof req.query.token === "string"
    ? req.query.token
    : "";

const code =
  typeof req.query.code === "string"
    ? req.query.code
    : "";
  const zodResult = validateResetPasswordTokenZodSchema.safeParse({
    token,
    code,
  });
  
  if (!zodResult.success)
    return res
      .status(401)
      .type("html")
      .send("<div >Invalid token or code or token is expired</div>");
  
  if (!token || !code)
    return res
      .status(401)
      .type("html")
      .send("<div >Invalid token or code or token is expired</div>");
  const userId = decodeTokenWithJwt(token).sub as string;
  if (!userId)
    return res
      .status(401)
      .type("html")
      .send("<div>Invalid token or code or token is expired</div>");
    
  const storedCode = await redisClient.get(`${userId}-reset-password-code`);
  if (!storedCode)
    return res
      .status(401)
      .type("html")
      .send("<div style='color:red'>Invalid token or code or token is expired</div>");
  if (storedCode !== code) {
    return res
      .status(401)
      .type("html")
      .send("<div>Invalid token or code or token is expired</div>");
  }
  await redisClient.del(`${userId}-reset-password-code`);
  const reftoken = signTokenWithJwt(userId, "15m");
  const accessCode = crypto.randomUUID();
  const shortSession = {
    id: userId,
    refreshToken: reftoken,
    createdAt: Date.now(),
    code: accessCode,
  };
  await redisClient.set(`shortSession-${accessCode}`, JSON.stringify(shortSession),{EX:15*60});

  return res.redirect(`${FRONTEND_URL}/submit-new-password?token=${accessCode}`);
});

export const resetPasswordController = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const {password, token} = req.body;
  const session =await redisClient.get(`shortSession-${token}`);
  if (!session){
    return sendJsonResponse(res, 401, { success: false, message: "Invalid token" });
  }

  const {id} = JSON.parse(session);
  const user = await getUserByIdWithPassword(id);
  if (!user) {
    return sendJsonResponse(res, 404, { success: false, message: "Invalid Request" });
  }
  ;
  const checkPassword= await verifyHashedToken(password,user.password as string);
  if(checkPassword){
    return sendJsonResponse(res, 400, { success: false, message: "Password already exists" });
  }
  await  redisClient.del(`shortSession-${token}`);
  const passwordHash=await generateHashToken(password);
  await updateUser({id:user.id},{password:passwordHash});
  
  return sendJsonResponse(res, 200, { success: true, message: "Password reset successfully" });
});
