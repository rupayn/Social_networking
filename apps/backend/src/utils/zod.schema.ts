import { z } from "zod";

/*
 ********************************************************************************************************************************************************************************************************
 *
 *    Sign in Schemas
 *
 * ********************************************************************************************************************************************************************************************************
 */

//  Manual Signin Schema

export const signInZodSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email address")
      .min(3, "Identifier must be at least 3 characters"),

    password: z
      .string()
      .trim()
      .superRefine((val, ctx) => {
        if (val.length < 8) {
          ctx.addIssue("Password must be at least 8 characters");
        }

        if (val.length > 32) {
          ctx.addIssue("Password must be at most 32 characters");
        }
        if (!/[!@#$%^&*\-=+_:.?]/.test(val)) {
          ctx.addIssue("Password must contain at least one special character [!@#$%^&*-=+_:.?]");
        }

        if (!/[0-9]/.test(val)) {
          ctx.addIssue("Password must contain at least one number");
        }

        if (!/[A-Z]/.test(val)) {
          ctx.addIssue("Password must contain at least one uppercase letter");
        }

        if (!/[a-z]/.test(val)) {
          ctx.addIssue("Password must contain at least one lowercase letter");
        }
      }),
  })
  .strict();

//  Google Signin Schema

export const signInWithGoogleZodSchema = z
  .object({
    code: z.string().min(1, "Authorization code is required"),
    scope: z.string().optional(),
    authuser: z.string().optional(),
    prompt: z.string().optional(),
  })
  .strict();

/*
 ********************************************************************************************************************************************************************************************************
 *
 *    Forgot Password in Schemas
 *
 * ********************************************************************************************************************************************************************************************************
 */

//  Forgot Password Schema

export const ForgotPasswordZodSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email address")
      .min(3, "Identifier must be at least 3 characters"),
  })
  .strict();
