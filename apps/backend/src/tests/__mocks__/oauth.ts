import { vi } from "vitest";

export const GOOGLE_SCOPES = ["openid", "email", "profile"];

export const googleOauth2Client = {
  generateAuthUrl: vi.fn().mockReturnValue("https://google-auth-url"),
  getToken: vi.fn().mockResolvedValue({
    tokens: { access_token: "google-access-token" },
  }),
  setCredentials: vi.fn(),
};

export const signTokenWithJwt = vi.fn().mockReturnValue("signed-jwt");
export const generateHashToken = vi.fn().mockResolvedValue("hashed-token");
