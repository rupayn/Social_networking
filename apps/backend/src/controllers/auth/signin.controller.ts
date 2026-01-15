import { asyncHandler } from "../../utils/handler.ts";
import express from "express";
import { prismaClient } from "../../utils/prismaClient.ts";
import bcrypt from "bcrypt";

export const signinController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    bcrypt.compare(`${user?.password}`, password);
    return res.status(200).json({ message: "Sign-in successful" });
  }
);

export const signInWithGoogleController = asyncHandler(
  async (_req: express.Request, _res: express.Response) => {}
);
