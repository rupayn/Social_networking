import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { myLog, configureLogger } from "@repo/logger/config";
import route from "@/routes/index.ts";
import { checkTokens } from "@/middleware/checkRefreshToken.ts";
import { FRONTEND_URL, NODE_ENV } from "./utils/envs.ts";

async function bootstrap(): Promise<Express> {
  configureLogger();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      methods: "GET, POST, PUT, DELETE, OPTIONS",
    })
  );
  app.use(cookieParser());

  if (NODE_ENV === "development") app.use(myLog);

  app.get("/", checkTokens, (req: express.Request, res: express.Response) => {
    const data = req.headers;
    const c = req.cookies;

    res.status(200).json({
      data,
      cookies: c,
      Greetings: "hi",
    });
  });
  app.use("/api", route);

  return app;
}

export { bootstrap };
