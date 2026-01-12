import express from "express";

import { asyncHandler } from "../../utils/handler.ts";
import { prismaClient } from "../../utils/prismaClient.ts";

export const forgotPassword = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const { email } = req.body;
  try {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password reset link sent to your email" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
});
