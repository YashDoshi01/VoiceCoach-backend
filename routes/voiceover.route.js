import express from "express";
import { CreatevoiceoverController , GetvoiceoverController } from "../controllers/voiceover.controller.js";
const voiceoverRouter = express.Router();

voiceoverRouter.post("/create", CreatevoiceoverController);
voiceoverRouter.get("/get", GetvoiceoverController);
export default voiceoverRouter;