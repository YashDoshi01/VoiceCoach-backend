import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { CreatePresentationController , getAllPresentations} from "../controllers/presentation.controller.js";
const presentationRouter = express.Router();
presentationRouter.post("/create" , verifyToken , CreatePresentationController);
presentationRouter.get("/get" , verifyToken , getAllPresentations);
export default presentationRouter;