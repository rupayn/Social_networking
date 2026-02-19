import { postOfficeUtilityControllers } from "@/controllers/utils/postOffice.Utility.Controller.ts";
import { Router } from "express";

const utilsRouter = Router();

utilsRouter.route("/post-office").get(postOfficeUtilityControllers);

export default utilsRouter;