import { Router } from "express";
import { signinController } from "../../controllers/auth/signin.controller.ts";
import { forgotPassword } from "../../controllers/auth/forgot.controller.ts";
import { signUpController } from "../../controllers/auth/signup.controller.ts";
import { validate } from "../../middleware/vaildate.ts";
import { ForgotPasswordZodSchema, signInZodSchema } from "../../utils/zod.schema.ts";

const authRouter = Router();

/*
 ********************************************************************************************************************************************************************************************************
 *  Signup route
 ****************************************************************************************************
 ****************************************************************************************************
*/
authRouter.route("/signup").post(signUpController);

/**
 ****************************************************************************************************
 ****************************************************************************************************
 * 
 * Signin route
 * 
 ********************************************************************************************************************************************************************************************************
 */

authRouter.route("/signin").post(validate(signInZodSchema),signinController); 

// Signin With google route

authRouter.route("/signin/google").post(signinController);
authRouter.route("/signin/google/callback").post(signinController);


authRouter.route("/forgot").post(validate(ForgotPasswordZodSchema),forgotPassword);
export default authRouter;
