import { Router } from "express";
import check from "./check.route.ts";

import authRouter from "./auth/signin.route.ts";
import utilsRouter from "./utils/utils.route.ts";

const route = Router();

route.use("/check", check);
route.use("/auth", authRouter);
route.use("/utils",utilsRouter)
export default route;
