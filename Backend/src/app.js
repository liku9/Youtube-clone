import express from "express";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import cors from "cors";
import actionRoutes from "./routes/miscellenousRoutes.js";
// Register all API routes for different endpoints of the application
const app = express();
app.use(cors({
  origin: true, // Reflects the request origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/actions",actionRoutes)
app.get("/", (req, res) => {
  res.send("API is running...");
});



export default app;