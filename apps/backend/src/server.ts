import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";

import api from "./routes/user.route.js";
import { myLog, configureLogger } from "@repo/logger/config";

async function bootstrap(): Promise<Express> {
  configureLogger();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:5473",
      credentials: true,
      methods: "GET, POST, PUT, DELETE, OPTIONS",
    })
  );

  if (process.env.NODE_ENV == "dev") app.use(myLog);
  app.get("/", (res: express.Response) => {
    res.send("Hii");
  });
  app.use("/api", api);

  return app;
}

export { bootstrap };
