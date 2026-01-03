import { asyncHandler } from "../../utils/handler.ts";
import express from "express";

export const signUpController = asyncHandler(
  async (_req: express.Request, res: express.Response) => {
    return res.status(200).json({ message: "Sign-up successful" });
  }
);
