import express from "express";
import { verifyToken } from "../middlewares/auth.js";

import { GetContentController  , CreateContentController} from "../controllers/content.controller.js";
const contentRouter = express.Router();
contentRouter.post("/create" , verifyToken , CreateContentController);
contentRouter.get("/get" , verifyToken , GetContentController);
export default contentRouter;