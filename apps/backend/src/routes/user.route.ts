import { logger } from "@repo/logger/config";
import { Router } from "express";
import express from "express";

const user = Router();

user.route("/").get((_req:express.Request,res: express.Response) => {
  res.send("Hii / ");
});
user.route("/olo").get((req: express.Request, res: express.Response) => {
  res.status(200).json({
    message: "olo",
    id: req.ip,
  });
  // console.log(process.env.DATABASE_URL!)
  logger.info(`Hii aoi ${req.ip}`);
});

export default user;
