import userModel from "../../models/userModel.js";
import videoModel from "../../models/videoModel.js";
async function toggleDislikeController(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        // Check if the video is already in the user's disliked list
        const isAlreadyDisliked = user.dislikedVideos.includes(videoId);
        let update;

        if (isAlreadyDisliked) {
            // Simply remove the dislike
            update = { $pull: { dislikedVideos: videoId } };
        } else {
            // Add to disliked AND ensure it's removed from liked
            update = { 
                $addToSet: { dislikedVideos: videoId },
                $pull: { likedVideos: videoId } 
            };
        }
        // Update the user document and return it with populated fields
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
        if (isAlreadyDisliked) {
            // Decrement dislikes count
            videoUpdate = { $inc: { dislikes: -1 } };
        } else {
            // Increment dislikes count and decrement likes if it was previously liked
            videoUpdate = { $inc: { dislikes: 1, likes: -1 } };
        }
        // Update the video's like/dislike counters
        await videoModel.findByIdAndUpdate(videoId, videoUpdate);
        res.status(200).json({ 
            message: isAlreadyDisliked ? "Dislike removed" : "Video disliked", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating dislike", error: error.message });
    }
}
export default toggleDislikeController