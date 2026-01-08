import  {google} from 'googleapis';
import crypto  from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

/**
 * 
 * 
 * Help full functions
 * 
 */

export function signAccessToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );
}
export function generateRefreshToken():string {
  return crypto.randomBytes(64).toString("hex");
}
export async function generateHashToken(token: string): Promise<string> {
  return bcrypt.hash(token, Number(process.env.SALT_ROUNDS!)||10);
}
export async function verifyToken(
  token: string,
  hashedToken: string
): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}


export const googleOauth2Client = new google.auth.OAuth2(
  process.env.O_AUTH_CLIENT_ID,
  process.env.O_AUTH_CLIENT_SECRET,
  process.env.REDIRECT_URI!
);

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
];
