import { z } from "zod";

/*
 ********************************************************************************************************************************************************************************************************
 *
 *    Sign in Schemas
 *
 * ********************************************************************************************************************************************************************************************************
 */

// user field helper
const urlField = z
  .string()
  .trim()
  .min(8, "URL must be at least 8 characters")
  .max(2048, "URL is too long")
  .transform((val) =>
    val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`
  )
  .refine((val) => {
    try {
      const url = new URL(val);
      return ["https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }, "Only HTTPS URLs are allowed")
  .refine((val) => val.startsWith("https://"), "Only HTTPS URLs are allowed")
  .pipe(z.string().url())
  .transform((val) => {
    const url = new URL(val);
    url.hostname = url.hostname.toLowerCase();
    return url.toString().replace(/\/$/, "");
  });
// Manual Sign Up Schema
export const signUpZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email address")
      .min(3, "Identifier must be at least 3 characters"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

    city: z
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/, "Invalid city name")
      .min(2, "City must be at least 2 characters")
      .max(100, "City name is too long"),

    state: z
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/, "Invalid state name")
      .min(2, "State must be at least 2 characters")
      .max(100, "State name is too long"),
    dist: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/, "Invalid district name")
      .min(2, "District must be at least 2 characters")
      .max(100, "District name is too long"),
    country: z
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/, "Invalid country name")
      .min(2, "Country must be at least 2 characters")
      .max(100, "Country name is too long"),

    pinCode: z
      .string()
      .trim()
      .regex(/^[0-9]{6}$/, "Pin code must be exactly 6 digits"),
    bio: z
      .string()
      .trim()
      .min(5, "Bio must be at least 5 characters")
      .max(160, "Bio must be at most 160 characters")
      .optional(),
    linkedin: urlField.optional(),
    github: urlField.optional(),
    twitter: urlField.optional(),
    website: urlField.optional(),
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

//  Manual Signin Schema

export const signInZodSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
        message: "Invalid credentials",
      })
      .min(3, { message: "Invalid credentials" }),

    password: z.string().trim().min(2, { message: "Invalid credentials" }),
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
    username: z.string().trim().min(3, "Username must be at least 3 characters"),
  })
  .strict();

/*
 ********************************************************************************************************************************************************************************************************
 *
 *    Users in Schemas
 *
 * ********************************************************************************************************************************************************************************************************
 */

//  Update User Schema

export const updateUserZodSchema = z.object({
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City name is too long")
    .optional(),

  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100, "State name is too long")
    .optional(),

  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country name is too long")
    .optional(),

  pinCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pin code must be exactly 6 digits")
    .optional(),
  bio: z
    .string()
    .trim()
    .min(5, "Bio must be at least 5 characters")
    .max(160, "Bio must be at most 160 characters")
    .optional(),
  linkedin: urlField.optional(),
  github: urlField.optional(),
  twitter: urlField.optional(),
  website: urlField.optional(),
});

//  Forgot Password:
export const forgotPasswordSendLinkZodSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email address")
      .min(3, "Identifier must be at least 3 characters"),
  })
  .strict();

export const validateResetPasswordTokenZodSchema = z
  .object({
    token: z.string().trim().min(10, "Token must be at least 10 characters"),

    code: z.string().trim().min(4, "Code must be at least 4 characters"),
  })
  .strict();

/*
 ********************************************************************************************************************************************************************************************************
 *
 *    Other Services in Schemas
 *
 * ********************************************************************************************************************************************************************************************************
 */

//  post office schema from pincode
export const postOfficeFromPinCodeZodSchema = z
  .object({
    pinCode: z.string().trim().length(6, "PIN code must be exactly 6 digits"),
  })
  .strict();
