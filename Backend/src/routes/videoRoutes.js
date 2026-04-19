import express from "express";
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkOwner } from "../middlewares/checkOwner.js";
import { requestLogger } from "../middlewares/Logger.js";

const router = express.Router();

// Apply logger to all video routes
router.use(requestLogger);
// Video management routes
router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/", authMiddleware, checkOwner, createVideo);
router.put("/:id", authMiddleware, checkOwner, updateVideo);
router.delete("/:id", authMiddleware, checkOwner, deleteVideo);

export default router;