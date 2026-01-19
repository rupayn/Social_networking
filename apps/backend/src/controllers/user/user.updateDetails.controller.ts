import { userSelect } from "@/types/user.types.ts";
import { asyncHandler } from "@/utils/handler.ts";
import { prismaClient } from "@/utils/prismaClient.ts";
import express from "express";

export const updateUserDetailsController = asyncHandler(async function (req: express.Request, res: express.Response) {
  const updateThings=req.body;
  if(!res.locals.userIdFromMiddleWare) return res.status(401).json({ message: "Unauthorized" });
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
    "github"
  ] as const;


  
  allowedFields.forEach((key) => {
    if (key  in updateThings){
      if (updateThings[key] !== undefined) updateData[key] = updateThings[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }
  const user=await prismaClient.user.update({
    where: { id: res.locals.userIdFromMiddleWare },
    data: updateData,
    select: userSelect
  });
  
  return res.status(200).json({
    message: "User details updated successfully", 
    user
  });
});