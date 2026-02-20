/**
 * Handles the forgot password process by generating a reset link and sending it to the user's email.
 *
 * @param req - Express request object containing the user's email in the body.
 * @param res - Express response object used to send the response.
 * @returns Sends a JSON response indicating the result of the operation.
 */

/**
 * Validates the reset password token and code from the reset link.
 *
 * @param req - Express request object containing the token and code as query parameters.
 * @param res - Express response object used to send the response or redirect.
 * @returns Redirects to the frontend password submission page if valid, otherwise sends an error HTML response.
 */

/**
 * Handles the password reset by validating the short session token and updating the user's password.
 *
 * @param req - Express request object containing the new password and session token in the body.
 * @param res - Express response object used to send the response.
 * @returns Sends a JSON response indicating the result of the password reset operation.
 */
import express from "express";

import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { sendMail } from "@/utils/sendMail.ts";
import { logger } from "@repo/logger/config";
import {
  decodeTokenWithJwt,
  generateHashToken,
  signTokenWithJwt,
  verifyHashedToken,
} from "@/utils/oauth.ts";
import { generateActionEmailTemplate } from "@/utils/actionTempletHtml.ts";
import { clearCache, getCache, setCache } from "@/utils/redisClient.ts";
import { getUserByEmail, getUserByIdWithPassword } from "@/services/user.ts";
import { BACKEND_URL, FRONTEND_URL } from "@/utils/envs.ts";
import { validateResetPasswordTokenZodSchema } from "@repo/zod-schemas/config";
import { updateUser } from "@/services/updateUser.ts";
import { RESET_PASSWORD_CODE_KEY, SHORT_SESSION_KEY } from "@/services/redis.keys.ts";

/**
 * Handles the forgot password request by generating a password reset link and sending it to the user's email.
 *
 * This controller performs the following steps:
 * 1. Extracts the user's email from the request body.
 * 2. Checks if a user with the provided email exists.
 * 3. Generates a JWT token and a unique code for password reset.
 * 4. Stores the reset code in cache with a 15-minute expiration.
 * 5. Constructs a password reset URL containing the token and code.
 * 6. Generates an HTML email template for the password reset action.
 * 7. Sends the password reset email to the user.
 * 8. Returns a success response if the email is sent, or an error response otherwise.
 *
 * @param req - Express request object containing the user's email in the body.
 * @param res - Express response object used to send the response.
 * @returns A JSON response indicating the result of the password reset link request.
 */
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
    await clearCache(RESET_PASSWORD_CODE_KEY(user.id));
    await setCache(RESET_PASSWORD_CODE_KEY(user.id), `${code}`, 15 * 60);

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
    await sendMail("Password Reset", htmlContent, email, user.name as string);
    return sendJsonResponse(res, 200, {
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error: unknown) {
    logger.error("Error in forgotPassword controller: \n", error);
    return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
  }
});

/**
 * Validates the reset password token and code provided in the query parameters.
 *
 * This controller performs the following steps:
 * 1. Extracts the `token` and `code` from the request query parameters.
 * 2. Validates the extracted values using a Zod schema.
 * 3. Decodes the JWT token to retrieve the user ID.
 * 4. Checks if the provided code matches the one stored in the cache for the user.
 * 5. Clears the used reset code from the cache.
 * 6. Generates a short-lived refresh token and an access code.
 * 7. Stores a short session in the cache with the access code as the key.
 * 8. Redirects the user to the frontend's submit-new-password page with the access code as a token.
 *
 * @param req - Express request object containing `token` and `code` in the query parameters.
 * @param res - Express response object used to send HTML error messages or perform a redirect.
 * @returns Redirects to the frontend password submission page if validation succeeds, otherwise sends an error HTML response.
 */
export const validateResetPasswordToken = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const token = typeof req.query.token === "string" ? req.query.token : "";

    const code = typeof req.query.code === "string" ? req.query.code : "";
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

    const storedCode = await getCache(RESET_PASSWORD_CODE_KEY(userId));
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
    await clearCache(RESET_PASSWORD_CODE_KEY(userId));
    const reftoken = signTokenWithJwt(userId, "15m");
    const accessCode = crypto.randomUUID();
    const shortSession = {
      id: userId,
      refreshToken: reftoken,
      createdAt: Date.now(),
      code: accessCode,
    };
    await setCache(SHORT_SESSION_KEY(accessCode), JSON.stringify(shortSession), 15 * 60);

    return res.redirect(`${FRONTEND_URL}/submit-new-password?token=${accessCode}`);
  } catch (error) {
    logger.error("Error in validateResetPasswordToken controller: \n", error);
    return res.status(500).type("html").send("<div style='color:red'>Internal server error</div>");
  }
});

/**
 * Handles the password reset process for a user.
 *
 * This controller verifies the provided reset token and new password, ensures the new password is not the same as the old one,
 * updates the user's password, and clears the reset session from cache.
 *
 * @param req - Express request object containing `password` and `token` in the body.
 * @param res - Express response object used to send the result of the operation.
 * @returns A JSON response indicating success or failure of the password reset operation.
 *
 * Responses:
 * - 200: Password reset successfully.
 * - 400: New password matches the existing password.
 * - 401: Invalid or expired token.
 * - 404: User not found or invalid request.
 */

export const resetPasswordController = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const { password, token } = req.body;
    const session = await getCache<string>(SHORT_SESSION_KEY(token));
    if (!session) {
      return sendJsonResponse(res, 401, { success: false, message: "Invalid token" });
    }

    const { id } = JSON.parse(session);
    const user = await getUserByIdWithPassword(id);
    if (!user) {
      return sendJsonResponse(res, 404, { success: false, message: "Invalid Request" });
    }
    const checkPassword = await verifyHashedToken(password, user.password as string);
    if (checkPassword) {
      return sendJsonResponse(res, 400, { success: false, message: "Password already exists" });
    }
    await clearCache(SHORT_SESSION_KEY(token));
    const passwordHash = await generateHashToken(password);
    await updateUser({ id: user.id }, { password: passwordHash });

    return sendJsonResponse(res, 200, { success: true, message: "Password reset successfully" });
  } catch (error) {
    logger.error("Error in resetPasswordController controller: \n", error);
    return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
  }
});
