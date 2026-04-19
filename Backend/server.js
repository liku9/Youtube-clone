import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";


// Initialize environment variables and establish database connection
dotenv.config();
connectDB();


// Define the port and start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);