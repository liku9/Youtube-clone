import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

export const checkOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (req.params.id) {
      // Update or Delete operation: Check if video belongs to a channel owned by user
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      const channel = await Channel.findById(video.channel);
      if (!channel || channel.owner.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to perform this action on this video" });
      }
    } else {
      // Create operation: Check if user has a channel
      const channel = await Channel.findOne({ owner: userId });
      if (!channel) {
        return res.status(400).json({ message: "You must create a channel to upload videos" });
      }
      req.channelId = channel._id; // Attach channel ID for the controller
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error during ownership check", error: error.message });
  }
};