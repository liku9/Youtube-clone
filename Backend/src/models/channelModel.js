import mongoose from "mongoose";

// Schema definition for the Channel model
const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    channelBanner: {
      type: String,
      default: "",
    },

    uniqueDeleteKey:{
      type:String,
      required:true,
    },
    
    subscribers: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);