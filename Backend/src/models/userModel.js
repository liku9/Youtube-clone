import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      // Remove whitespace from both ends of the name string
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Convert email to lowercase and remove whitespace for consistency
    },
    password: {
      type: String,
      required: true,
      select: false,
      // Prevent password from being included in query results by default for security
    },
      avatar: {
      type: String,
      default: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_user_personalization&w=740&q=80",
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", // Reference to the user's own channel
      default: null,
    },
     // Subscribed channels
    subscribedChannels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel", // List of channels the user has subscribed to
      },
    ],

    // Liked videos
    likedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // List of videos the user has liked
      },
    ],
    dislikedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // List of videos the user has disliked
      },
    ],

    //watch later
     watchLater: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // List of videos saved for later viewing
      },
    ],

    // Watch history
    watchHistory: [
      {
        video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video", // Reference to a video in the user's watch history
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

  

 
export default mongoose.model("User", userSchema);