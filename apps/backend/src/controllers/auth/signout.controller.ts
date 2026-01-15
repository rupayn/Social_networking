import express from "express";
import { asyncHandler } from "@/utils/handler.ts";
export const signoutController = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const cookies = req.cookies;
  const ae=Object.keys(cookies).map((cookieName) => {
    
    res.clearCookie(cookieName,{
      httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "development" ? false : true
    })
  });

  res.status(200).json({ ae,message: "Sign-out successful" });
});
