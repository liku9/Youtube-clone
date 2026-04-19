import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import updateUserController from "../controllers/updateUserController.js";
import deleteUserController from "../controllers/deleteUserController.js";
import getUserController from "../controllers/getUserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requestLogger } from "../middlewares/Logger.js";

// Initialize the authentication router
const router = express.Router();
router.use(requestLogger);

// Auth and user management endpoints
router.post("/register", registerController);
router.post("/login", loginController);
router.put("/update", authMiddleware, updateUserController);
router.delete("/delete", authMiddleware, deleteUserController);
router.get("/me", authMiddleware, getUserController);

export default router;