import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { myLog, configureLogger } from "@repo/logger/config";
import route from "./routes/index.ts";
import { checkRefreshTokenDate } from "./middleware/checkRefeshToken.ts";
import { ApiError } from "./utils/customError.ts";

async function bootstrap(): Promise<Express> {
  configureLogger();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: "GET, POST, PUT, DELETE, OPTIONS",
    })
  );
  app.use(cookieParser());

  if (process.env.NODE_ENV === "development") app.use(myLog);

   // ❗ global error handler (MANDATORY)
  app.use((
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        message: err.message,
        errors: err.errors,
      });
    }

    // internal logging
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  });

  app.get("/", checkRefreshTokenDate, (req: express.Request, res: express.Response) => {
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
