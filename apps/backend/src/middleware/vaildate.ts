import { sendJsonResponse } from "@/utils/handler.ts";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import fs from "fs/promises";
import { logger } from "@repo/logger/config";

type ValidateSource = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodType<T>, source: ValidateSource = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req.body = parsed;
      return next();
    } catch (error) {
      const allFiles: Express.Multer.File[] = [];
      try {
        if (req.file) {
          allFiles.push(req.file);
        }
        if (req.files) {
          if (Array.isArray(req.files)) {
            allFiles.push(...req.files);
          } else {
            Object.values(req.files)
              .flat()
              .forEach((file: Express.Multer.File) => {
                if (file?.path) allFiles.push(file);
              });
          }
        }
        await Promise.all(
          allFiles.map((file) =>
            fs.unlink(file.path).catch((er) => {
              logger.error("Temp cleanup failed in validate middleware:", er);
            })
          )
        );
      } catch (cleanupError) {
        logger.error("Unexpected cleanup failure:", cleanupError);
      }

      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return sendJsonResponse(res, 400, {
          success: false,
          errors: formattedErrors,
        });
      }
      return sendJsonResponse(res, 400, {
        success: false,
        errors: error instanceof Error? error?.message||error :"Something went wrong",
      });
    }
  };
