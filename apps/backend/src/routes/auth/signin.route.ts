import { Router } from "express";
import { signinController } from "@/controllers/auth/signin.controller.ts";
import { forgotPassword } from "@/controllers/auth/forgot.controller.ts";
import {
  signUpWithGoogleController,
  signWithGoogleControllerCallback,
} from "@/controllers/auth/signWithGoogle.controller.ts";
import { validate } from "@/middleware/vaildate.ts";
import {
  ForgotPasswordZodSchema,
  signInWithGoogleZodSchema,
  signInZodSchema,
  signUpZodSchema,
} from "@repo/zod-schemas/config";
import { signUpController } from "@/controllers/auth/signup.controller.ts";
import { signoutController } from "@/controllers/auth/signout.controller.ts";
import { checkTokens } from "@/middleware/checkRefreshToken.ts";

const authRouter = Router();

/*
 ********************************************************************************************************************************************************************************************************
 *  Signup route
 ****************************************************************************************************
 ****************************************************************************************************
 */
authRouter.route("/signup").post(validate(signUpZodSchema), signUpController);
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

authRouter.route("/forgot").post(validate(ForgotPasswordZodSchema), forgotPassword);

/*
 ********************************************************************************************************************************************************************************************************
 *  Signup route
 ****************************************************************************************************
 ****************************************************************************************************
 */

authRouter.route("/signout").post(checkTokens, signoutController);

export default authRouter;
