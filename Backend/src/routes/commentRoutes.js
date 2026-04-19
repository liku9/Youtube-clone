// routes/commentRoutes.js
import express from "express";
import { getAllComments, handleCommentEdits, addComment, deleteComment } from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const commentRouter = express.Router();

// Get comments for a specific video
commentRouter.get("/:videoId", getAllComments);

// Add a new comment
commentRouter.post("/", authMiddleware, addComment);

// Patch a specific comment by its own ID
commentRouter.patch("/:id", authMiddleware, handleCommentEdits);

// Delete a comment
commentRouter.delete("/:id", authMiddleware, deleteComment);

export default commentRouter;