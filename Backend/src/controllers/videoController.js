import Video from "../models/videoModel.js";
import { logError } from "../utils/logger.js";
// Controller to fetch all videos with channel and uploader info
export const getAllVideos = async (req,res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "channelName")
      .populate("uploader", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(videos); // even if empty []

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Controller to handle new video uploads
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;
    const userId = req.user.id;
    // req.channelId is set by the checkOwner middleware

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category: category.trim().toLowerCase(),
      channel: req.channelId,
      uploader: userId,
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Error creating video", error: error.message });
  }
};
// Controller to update existing video metadata
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnailUrl, category } = req.body;
    // Find and update the video by ID
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, description, thumbnailUrl, category },
      { new: true }
    );

    res.status(200).json(updatedVideo);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};
// Controller to remove a video from the database
export const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};
// Controller to fetch a single video's details by its ID
export const getVideoById = async (req,res) => {
    try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName description subscribers")
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};