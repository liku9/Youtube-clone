import mongoose from "mongoose";
import channelModel from "../models/channelModel.js";
import commentModel from "../models/commentModel.js"
import videoModel from "../models/videoModel.js"



const userId = "6979f90ec25d643bf2fbb348";

const connectDB = async () => {
  try {
    // Ensure the connection string is present before attempting to connect
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    // Attempt to establish a connection to the MongoDB cluster
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the specific error and exit the process with a failure code
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};


// addData()

export default connectDB;