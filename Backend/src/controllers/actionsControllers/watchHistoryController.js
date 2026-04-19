import userModel from "../../models/userModel.js";
import videoModel from "../../models/videoModel.js";

async function setWatchHistory(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        if (!videoId) {
            return res.status(400).json({ message: "Video ID is required" });
        }
        // Find the user to update their watch history
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if video is already in watch history
        const existingEntry = user.watchHistory.find(
            entry => entry.video.toString() === videoId
        );

        if (existingEntry) {
            // Update the watchedAt timestamp for existing entry
            existingEntry.watchedAt = new Date();
            await user.save();
        } else {
            // Add new entry to watch history
            user.watchHistory.push({
                video: videoId,
                watchedAt: new Date()
            });
            await user.save();
            
            // Increment video views count only when first watched
            await videoModel.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
        }

        // Fetch full user data to return
        const fullUser = await userModel.findById(id)
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
            message: "Watch history updated successfully",
            watchHistory: fullUser.watchHistory,
            user: fullUser // Also return the full user for state updates if needed
        });

    } catch (error) {
        console.error("Watch History Error:", error);
        res.status(500).json({ message: "Error updating watch history", error: error.message });
    }
}
// Controller to remove a video from the user's watch history
async function removeFromWatchHistory(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        if (!videoId) {
            return res.status(400).json({ message: "Video ID is required" });
        }
        // Pull the video from watch history and return the updated user with populated fields
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $pull: { watchHistory: { video: videoId } } },
            { new: true }
        ).populate({
            path: "watchHistory.video",
            select: "title thumbnailUrl views category duration createdAt"
        })
        .populate("likedVideos")
        .populate("dislikedVideos")
        .populate("channel")
        .populate("subscribedChannels")
        .populate({
            path: "watchLater",
            populate: { path: "channel uploader", select: "channelName username avatar" },
        });
        // Verify if the update was successful
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Video removed from watch history",
            user: updatedUser
        });

        console.log({
            message: "Video removed from watch history",
            user: updatedUser
        })

    } catch (error) {
        console.error("Remove Watch History Error:", error);
        res.status(500).json({ message: "Error removing from watch history", error: error.message });
    }
}
// Export the watch history controllers
export default setWatchHistory;
export { removeFromWatchHistory };