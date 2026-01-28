import express from "express";

import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { prismaClient } from "@/utils/prismaClient.ts";

export const forgotPassword = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const { email } = req.body;
  try {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return sendJsonResponse(res, 404, { success: false, message: "User not found" });
    }

    return sendJsonResponse(res, 200, {
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch {
    return sendJsonResponse(res, 500, { success: false, message: "Internal server error" });
  }
});
