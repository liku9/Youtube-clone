import express from "express";
import { createChannel, getAllChannels, getChannelById, deleteChannel, updateChannel } from "../controllers/channelController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requestLogger } from "../middlewares/Logger.js";

const channelRouter = express.Router();
// Publicly accessible routes
channelRouter.use(requestLogger)
channelRouter.get("/", requestLogger, getAllChannels);
channelRouter.get("/:id", requestLogger, getChannelById);

// Protected routes
// Routes that require user authentication
channelRouter.post("/", authMiddleware, createChannel);
channelRouter.put("/:id", authMiddleware, updateChannel);
channelRouter.delete("/:id", authMiddleware, deleteChannel);

export default channelRouter;