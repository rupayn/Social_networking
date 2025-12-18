import { logger } from "@repo/logger/config";
import { Router } from "express";
import express from "express";

const api = Router();

api.route("/").get((res: express.Response) => {
  res.send("Hii / ");
});
api.route("/olo").get((res: express.Response) => {
  res.send("Hii aoi");
  // console.log(process.env.DATABASE_URL!)
  logger.info("Hii aoi");
});

export default api;
