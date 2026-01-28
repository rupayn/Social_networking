import { userSelect } from "@/types/user.types.ts";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import express from "express";

export const updateUserDetailsController = asyncHandler(async function (
  req: express.Request,
  res: express.Response
) {
  const updateThings = req.body;
  if (!res.locals.userIdFromMiddleWare)
    return sendJsonResponse(res, 401, { success: false, message: "Unauthorized" });
  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "state",
    "name",
    "country",
    "phone",
    "bio",
    "pinCode",
    "city",
    "website",
    "twitter",
    "linkedin",
    "github",
  ] as const;

  allowedFields.forEach((key) => {
    if (key in updateThings) {
      if (updateThings[key] !== undefined) updateData[key] = updateThings[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return sendJsonResponse(res, 400, { message: "No valid fields provided for update" });
  }
  const user = await prismaClient.user.update({
    where: { id: res.locals.userIdFromMiddleWare },
    data: updateData,
    select: userSelect,
  });

  return sendJsonResponse(res, 200, {
    success: true,
    message: "User details updated successfully",
    user,
  });
});
