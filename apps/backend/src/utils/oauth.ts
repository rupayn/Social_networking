import "dotenv/config";
import { google } from "googleapis";
import crypto from "crypto";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 *
 *
 * Help full functions
 *
 */

export type TokenExpiry =
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "7d";


const JWT_SECRET: string=process.env.JWT_ACCESS_SECRET! as string
export function signTokenWithJwt(data: string,expiresIn?: TokenExpiry): string  {
  let subject: unknown = data;

  try {
    subject = JSON.parse(data);
  } catch {
    // data is not JSON; keep as string
  }

  const payload = { sub: subject };

  return jwt.sign(payload, JWT_SECRET, expiresIn ? { expiresIn } : undefined);
}

export function decodeTokenWithJwt(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) ;
} 

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}
export async function generateHashToken(token: string): Promise<string> {
  return bcrypt.hash(token, Number(process.env.SALT_ROUNDS!) || 10);
}
export async function verifyHashedToken(token: string, hashedToken: string): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}

export const googleOauth2Client = new google.auth.OAuth2(
  process.env.O_AUTH_CLIENT_ID!,
  process.env.O_AUTH_CLIENT_SECRET!,
  process.env.REDIRECT_URI!
);

export const GOOGLE_SCOPES = ["openid", "email", "profile"];
