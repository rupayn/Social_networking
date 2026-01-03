import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";

import { myLog, configureLogger } from "@repo/logger/config";
import route from "./routes/index.ts";

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

  if (process.env.NODE_ENV === "development") app.use(myLog);
  app.get("/", (_req, res: express.Response) => {
    res.status(200).json({
      Greetings: "hi",
    });
  });
  app.use("/api", route);

  return app;
}

export { bootstrap };
