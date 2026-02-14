import { updateUser } from "@/services/updateUser.ts";
import { getUserById } from "@/services/user.ts";
import { generateActionEmailTemplate } from "@/utils/actionTempletHtml.ts";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { decodeTokenWithJwt, signTokenWithJwt } from "@/utils/oauth.ts";
import { sendMail } from "@/utils/sendMail.ts";
import crypto from "crypto";
import { logger } from "@repo/logger/config";
import express from "express";
// import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
export const sendVerifyEmailLinkController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      let user;
      if (res.locals.userFromMiddleware) {
        user = res.locals.userFromMiddleware;
      } else {
        user = req.cookies["access_token"] ? res.locals.userFromMiddleware : null;
      }
      if (!user) return sendJsonResponse(res, 401, { success: false, message: "Unauthorized" });
      if (user.emailVerified)
        return sendJsonResponse(res, 400, { success: false, message: "Email already verified" });
      const token = signTokenWithJwt(user.id, "1d");
      const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;
      const htmlContent = generateActionEmailTemplate({
        title: "Verify your email",
        greetingName: user.name?.split(" ")[0],
        message:
          "Please click the button below to verify your email address.<span style='font-weight: 600;color:`#FF1493`'> By verifying your email, you can access the full functionalities of Porilekh </span>",
        actionText: "Verify Email",
        actionLink: verificationLink,
        footerNote: "If you did not create an account, no further action is required.",
      });
      await sendMail("Verify your email", htmlContent, user.email, user.name as string);
      return sendJsonResponse(res, 200, { success: true, message: "Email verified successfully" });
    } catch (error) {
      logger.error("Error in sendVerifyEmailLinkController: \n", error);
      return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
    }
  }
);

export const verifyEmailController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const token = typeof req.query.token === "string" ? req.query.token : "";

      if (!token) {
        return res.status(400).send("<div style='color:red'>Invalid verification link</div>");
      }
      const decodedToken = decodeTokenWithJwt(token);
      if (!decodedToken) {
        return res
          .status(400)
          .send("<div style='color:red'>Invalid or expired verification link</div>");
      }
      const userId = decodedToken.sub as string;
      if (!userId) {
        return res.status(400).send("<div style='color:red'>Invalid verification link</div>");
      }
      const user = await getUserById(userId);
      if (!user) {
        return res.status(400).send("<div style='color:red'>User not found</div>");
      }
      if (user.emailVerified) {
        return res.status(400).send("<div style='color:green'>Email already verified</div>");
      }
      const username=`${String(user.email)
      .split("@")[0]
      ?.toLowerCase()
      }${crypto.randomBytes(6).toString("hex")}`;
      await updateUser({ id: userId }, { username,emailVerified: true, emailVerifiedAt: new Date() });
      await sendMail(
        "Email Verified Successfully",
        `<div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Email Verified Successfully!</h2>
            <p style="font-size: 15px;">
               Hi ${user.name || "User"},<br/><br/>
              Your email address has been successfully verified. Welcome to
              <strong style="color: #2563eb;">Porilekh</strong>! We are excited to have you on board.
            </p>

            <p style="font-size: 15px;">
              🎉 Your account on 
              <strong style="color: #2563eb;">Porilekh</strong> has been completed successfully. <strong>${username}</strong> is your stable user name. You can now enjoy all the features and benefits of our platform. 
            </p>

            <p style="font-size: 15px;">
              💙 Thank you for choosing to join our platform. We hope you enjoy your experience with Porilekh!
            </p>
        </div>`,
        user.email,
        user.name as string
      );
      return res.status(200).send("<div style='color:green'>Email verified successfully</div>");
    } catch (error) {
      logger.error("Error in verifyEmailController: \n", error);
      return res.status(500).send("<div style='color:red'>Internal Server Error</div>");
    }
  }
);
