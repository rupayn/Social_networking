import { sendJsonResponse } from "@/utils/handler.ts";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

type ValidateSource = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodType<T>, source: ValidateSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendJsonResponse(res, 400, {
          success: false,
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      return sendJsonResponse(res, 400, {
        success: false,
        errors: error,
      });
    }
  };
