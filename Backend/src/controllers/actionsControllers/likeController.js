import userModel from "../../models/userModel.js";
import videoModel from "../../models/videoModel.js";
async function toggleLikeController(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;
        // Find the user to determine if the video is already liked
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isAlreadyLiked = user.likedVideos.includes(videoId);
        let update;

        if (isAlreadyLiked) {
            // Simply remove the like
            update = { $pull: { likedVideos: videoId } };
        } else {
            // Add to liked AND ensure it's removed from disliked
            update = { 
                $addToSet: { likedVideos: videoId },
                $pull: { dislikedVideos: videoId } 
            };
        }
        // Apply the update and return the populated user object
        const updatedUser = await userModel.findByIdAndUpdate(id, update, { new: true })
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
        
        // Update video likes/dislikes count
        let videoUpdate;
        if (isAlreadyLiked) {
            // Decrement likes count
            videoUpdate = { $inc: { likes: -1 } };
        } else {
            // Increment likes count and decrement dislikes if it was previously disliked
            videoUpdate = { $inc: { likes: 1, dislikes: -1 } };
        }
        
        await videoModel.findByIdAndUpdate(videoId, videoUpdate);
        res.status(200).json({ 
            message: isAlreadyLiked ? "Like removed" : "Video liked", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating like", error: error.message });
    }
}
export default toggleLikeController