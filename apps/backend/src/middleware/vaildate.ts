
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed=schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.issues.map(issue => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      return res.status(400).json({
        success: false,
        errors: error,
      });
    }
  };
  }