import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

const deleteUserController = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has a channel
    const channel = await Channel.findOne({ owner: userId });

    if (channel) {
      // Delete all videos associated with the channel
      await Video.deleteMany({ channel: channel._id });
      
      // Delete the channel itself
      await Channel.findByIdAndDelete(channel._id);
    }

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error during deletion" });
  }
};

export default deleteUserController;