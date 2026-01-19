import { getUserById } from "@/db-red/user.ts";
import { asyncHandler } from "@/utils/handler.ts";

import express from "express";
export const getUserDetailsController = asyncHandler(async (req:express.Request, res:express.Response) => {
  if(!res.locals.userIdFromMiddleWare) return res.status(401).json({ message: "Unauthorized" });
  const user = await getUserById(res.locals.userIdFromMiddleWare);
  return res.status(200).json(user);
});
