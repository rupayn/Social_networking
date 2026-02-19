import { Router } from "express";
import { signinController } from "@/controllers/auth/signin.controller.ts";
import { forgotPasswordSendLink, resetPasswordController, validateResetPasswordToken } from "@/controllers/auth/forgot.controller.ts";
import {
  signUpWithGoogleController,
  signWithGoogleControllerCallback,
} from "@/controllers/auth/signWithGoogle.controller.ts";
import { validate } from "@/middleware/vaildate.ts";
import {
  forgotPasswordSendLinkZodSchema,
  ForgotPasswordZodSchema,
  signInWithGoogleZodSchema,
  signInZodSchema,
  signUpZodSchema,
} from "@repo/zod-schemas/config";
import { signUpController } from "@/controllers/auth/signup.controller.ts";
import { signoutController } from "@/controllers/auth/signout.controller.ts";
import { checkTokens } from "@/middleware/checkRefreshToken.ts";
import { sendVerifyEmailLinkController, verifyEmailController } from "@/controllers/auth/verify.email.controller.ts";
import { singleUploadDpAndCv } from "@/middleware/multer.ts";

const authRouter = Router();

/*
 ********************************************************************************************************************************************************************************************************
 *  Sign routes
 ****************************************************************************************************
 ****************************************************************************************************
 */
authRouter.route("/signup").post(singleUploadDpAndCv,validate(signUpZodSchema), signUpController);
authRouter.route("/signin").post(validate(signInZodSchema), signinController);

/**
 ****************************************************************************************************
 ****************************************************************************************************
 *
 * Sign with oAuth route
 *
 ********************************************************************************************************************************************************************************************************
 */

// Sign With google route

authRouter.route("/sign/google").get(signUpWithGoogleController);
authRouter
  .route("/sign/google/callback")
  .get(validate(signInWithGoogleZodSchema, "query"), signWithGoogleControllerCallback);

authRouter.route("/forgot").post(validate(ForgotPasswordZodSchema), forgotPasswordSendLink);

/*
 ********************************************************************************************************************************************************************************************************
 *  Signup route
 ****************************************************************************************************
 ****************************************************************************************************
 */

authRouter.route("/signout").post(checkTokens, signoutController);

export default authRouter;



//  email verification route
authRouter.route("/send-verify-email-link").post(checkTokens,sendVerifyEmailLinkController);
authRouter.route("/verify-email").get(verifyEmailController);

// Forgot password routes
authRouter.route("/forgot-password-send-link").post(validate(forgotPasswordSendLinkZodSchema),forgotPasswordSendLink)
authRouter.route("/validate-reset-password-token").get(validateResetPasswordToken);
authRouter.route("/reset-password").post(resetPasswordController);
