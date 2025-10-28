import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { GetDashboardController } from "../controllers/recording.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", verifyToken, GetDashboardController);

export default dashboardRouter;
