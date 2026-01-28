import { getUserDetailsController } from "@/controllers/user/user.details.controller.ts";
import { updateUserDetailsController } from "@/controllers/user/user.updateDetails.controller.ts";
import { checkTokens } from "@/middleware/checkRefreshToken.ts";
import { validate } from "@/middleware/vaildate.ts";
import { updateUserZodSchema } from "@/utils/zod.schema.ts";
import { Router } from "express";
const userRouter = Router();

userRouter.route("/get-user-details").post(checkTokens, getUserDetailsController);
userRouter
  .route("/update-user-details")
  .post(validate(updateUserZodSchema), checkTokens, updateUserDetailsController);
