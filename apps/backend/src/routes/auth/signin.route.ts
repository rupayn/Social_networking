import { Router } from "express";
import { signinController } from "../../controllers/auth/signin.controller.ts";
import { forgotPassword } from "../../controllers/auth/forgot.controller.ts";
import { signUpController } from "../../controllers/auth/signup.controller.ts";
import { validate } from "../../middleware/vaildate.ts";
import { ForgotPasswordZodSchema, signInZodSchema } from "../../utils/zod.schema.ts";

const authRouter = Router();

authRouter.route("/signin").post(validate(signInZodSchema),signinController);
authRouter.route("/signup").post(signUpController);
authRouter.route("/forgot").post(validate(ForgotPasswordZodSchema),forgotPassword);
export default authRouter;
