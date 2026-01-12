import { Router } from "express";
import user from "./user.route.ts";

import authRouter from "./auth/signin.route.ts";

const route = Router();

route.use("/user", user);
route.use("/auth", authRouter);
export default route;
