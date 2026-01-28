import express from "express";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
export const signoutController = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const cookies = req.cookies;
  Object.keys(cookies).map((cookieName) => {
    res.clearCookie(cookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
    });
  });

  sendJsonResponse(res, 200, { success: true, message: "Sign-out successful" });
});
