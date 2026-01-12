import { Router } from "express";
import { signinController } from "../../controllers/auth/signin.controller.ts";
import { forgotPassword } from "../../controllers/auth/forgot.controller.ts";
import {
  signUpWithGoogleController,
  signWithGoogleControllerCallback,
} from "../../controllers/auth/signWithGoogle.controller.ts";
import { validate } from "../../middleware/vaildate.ts";
import {
  ForgotPasswordZodSchema,
  signInWithGoogleZodSchema,
  signInZodSchema,
} from "../../utils/zod.schema.ts";
import { signUpController } from "../../controllers/auth/signup.controller.ts";

const authRouter = Router();

/*
 ********************************************************************************************************************************************************************************************************
 *  Signup route
 ****************************************************************************************************
 ****************************************************************************************************
 */
authRouter.route("/signup").post(signUpController);
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
export default authRouter;
