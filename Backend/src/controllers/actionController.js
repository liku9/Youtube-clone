import User from "../models/userModel.js";
import Video from "../models/videoModel.js";

export const toggleWatchLater = async (req, res) => {
  // Logic to add or remove a video from the user's "Watch Later" list
  try {
    const { videoId } = req.body;
    const userId = req.user.id;
    // Find the user to check current watch later status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if video is already in watchLater
    const isAdded = user.watchLater.includes(videoId);

    if (isAdded) {
      await User.findByIdAndUpdate(userId, {
        $pull: { watchLater: videoId },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { watchLater: videoId },
      });
    }

    // Return the updated user with full population to keep frontend context in sync
    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate({
        path: "likedVideos",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate({
        path: "dislikedVideos",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate("channel")
      .populate("subscribedChannels")
      .populate({
        path: "watchLater",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate({
        path: "watchHistory.video",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      });

    res.status(200).json({
      message: isAdded ? "Removed from Watch Later" : "Added to Watch Later",
      user: updatedUser,
    });
    // Handle potential errors during the toggle operation
  } catch (error) {
    res.status(500).json({ message: "Error toggling Watch Later", error: error.message });
  }
};