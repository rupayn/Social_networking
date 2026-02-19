import { PIN_CODE_API_KEY } from "@/utils/envs.ts";
import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { logger } from "@repo/logger/config";

export const postOfficeUtilityControllers = asyncHandler(async function (req, res) {
  try {
    const { pinCode } = req.query;
    const result = await fetch(`https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=${PIN_CODE_API_KEY}&format=json&filters%5Bpincode%5D=${pinCode}`);
    const data = await result.json();
    res.json(data);
  } catch (error) {
    logger.error("Error in post office utility controller:", error);
    return sendJsonResponse(res, 500, {message:"An error occurred while fetching post office data."});
  }
});
