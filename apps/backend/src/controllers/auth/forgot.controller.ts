import express from "express";

import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import { sendMail } from "@/utils/sendMail.ts";
import { logger } from "@repo/logger/config";
import { decodeTokenWithJwt, signTokenWithJwt } from "@/utils/oauth.ts";
import { generateActionEmailTemplate } from "@/utils/actionTempletHtml.ts";
import { redisClient } from "@/utils/redisClient.ts";


export const forgotPasswordSendLink = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const { email } = req.body;
  try {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return sendJsonResponse(res, 404, { success: false, message: "User not found" });
    }
    
    const token = signTokenWithJwt(user.id, "15m");
    const code=crypto.randomUUID();
    await redisClient.set(`${user.id}-reset-password-code`,`${code}`,{EX:15*60})
    const url = `http://localhost:3000/reset-password?token=${token}&code=${code}`;
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
    const mailResponse = await sendMail("Password Reset", htmlContent, email);
    return sendJsonResponse(res, 200, {
      success: true,
      message: "Password reset link sent to your email",
      mailResponse,
    });
  } catch(
    error:unknown
  ) {
    logger.error("Error in forgotPassword controller: \n", error);
    return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
  }
});

export const validateResetPasswordToken = asyncHandler(async function (req: express.Request, res: express.Response) {
  const toekn=req.query.token as string;
  const code=req.query.code as string;
  try {
    const userId = decodeTokenWithJwt(toekn) as string;
    const storedCode=await redisClient.get(`${userId}-reset-password-code`);
    if(storedCode!==code){
      return sendJsonResponse(res, 400, { success: false, message: "Invalid or expired code" });
    }
    return sendJsonResponse(res, 200, { success: true, message: "Token is valid", userId });
  } catch (error: unknown) {
    logger.error("Error in validateResetPasswordToken controller: \n", error);
    return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
  }
});
export const resetPasswordController = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  let userId:string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ") &&
    !Object.hasOwn(req.body,"userId")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    userId = decodeTokenWithJwt(token as string) as string;
  }
  else if (Object.hasOwn(req.body,"userId")) {
    userId = req.body.userId;
  }
  else return sendJsonResponse(res, 400, { success: false, message: "No token provided" });

  

  const { newPassword } = req.body;
  return sendJsonResponse(res, 200, {
    success: true,
    message: "Password reset successfully",
    userId,
  });
});