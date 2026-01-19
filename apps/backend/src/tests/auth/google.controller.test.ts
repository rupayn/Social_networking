import { describe, it, expect,vi } from "vitest";
import express from "express";
import request from "supertest";
import { signUpWithGoogleController, signWithGoogleControllerCallback } from "@/controllers/auth/signWithGoogle.controller.ts";

const generateAuthUrl = vi.fn().mockReturnValue("https://google-auth-url");
const getToken = vi.fn().mockResolvedValue({
  tokens: { access_token: "google-access-token" },
});
const setCredentials = vi.fn();

vi.mock("../__mocks__/googleapis.ts", () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation(() => ({
        generateAuthUrl,
        getToken,
        setCredentials,
      })),
    },
    oauth2: vi.fn().mockReturnValue({
      userinfo: {
        get: vi.fn().mockResolvedValue({
          data: {
            email: "test@gmail.com",
            name: "Test User",
            picture: "https://avatar.png",
          },
        }),
      },
    }),
  },
}));
vi.mock("@/utils/oauth.ts");
vi.mock("../../utils/prismaClient.ts");


const app = express();
app.get("/auth/google", signUpWithGoogleController);
app.get("/auth/google/callback", signWithGoogleControllerCallback);

describe("Google OAuth Controllers", () => {
  it("redirects to Google", async () => {
    const res = await request(app).get("/auth/google");
    expect(res.status).toBe(302);
  });
});
