import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import { bootstrap } from "@/server.ts";
import { type Express } from "express";
describe("Google Auth Controller", () => {
  let app: Express;

  beforeAll(async () => {
    app = await bootstrap();
  });

  it("returns 200 and olo message", async () => {
    const res = await request(app).get("/api/user/olo");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "olo");
  });
});
