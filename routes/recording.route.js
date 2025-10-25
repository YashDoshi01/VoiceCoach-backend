import express from "express";
import parser from "../util/multer.js";
import { verifyToken } from "../middlewares/auth.js";
import { CreaterecordingController, GetrecordingController } from "../controllers/recording.controller.js";
const recordingRouter = express.Router();

recordingRouter.post("/create" , verifyToken, parser.single("audio") , CreaterecordingController);
recordingRouter.get("/get/:id" , verifyToken , GetrecordingController)
export default recordingRouter;