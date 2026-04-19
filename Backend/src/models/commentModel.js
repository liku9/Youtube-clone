import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video", // The video this comment belongs to
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who authored the comment
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);