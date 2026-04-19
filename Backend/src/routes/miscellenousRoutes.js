import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import toggleLikeController from "../controllers/actionsControllers/likeController.js";
import toggleDislikeController from "../controllers/actionsControllers/dislikeController.js";
import toggleSubscribeController from "../controllers/actionsControllers/subscribeController.js";
import setWatchHistory, { removeFromWatchHistory } from "../controllers/actionsControllers/watchHistoryController.js";
import { toggleWatchLater} from "../controllers/actionController.js";
import {requestLogger} from "../middlewares/Logger.js"

const router = express.Router();
router.use(requestLogger)

// Routes for various user actions like liking, subscribing, and history management

router.post("/likes", authMiddleware, toggleLikeController);
router.post("/subscribe", authMiddleware, toggleSubscribeController);
router.post("/dislikes", authMiddleware, toggleDislikeController);
router.post("/watchhistory", authMiddleware, setWatchHistory);
router.delete("/watchhistory", authMiddleware, removeFromWatchHistory);
router.post("/watchlater", authMiddleware, toggleWatchLater);
router.delete("/watchlater", authMiddleware, toggleWatchLater);

export default router;