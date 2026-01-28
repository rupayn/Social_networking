import { getUserById } from "@/db-red/user.ts";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";

import express from "express";
export const getUserDetailsController = asyncHandler(
  async (_req: express.Request, res: express.Response) => {
    if (!res.locals.userIdFromMiddleWare)
      return sendJsonResponse(res, 401, { success: false, message: "Unauthorized" });
    const user = await getUserById(res.locals.userIdFromMiddleWare);
    return sendJsonResponse(res, 200, { success: true, user });
  }
);
