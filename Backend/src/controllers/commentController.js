import Comment from "../models/commentModel.js";

// Controller to retrieve all comments for a specific video
export const getAllComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    // We find comments by video ID and 'populate' the user field 
    // to get the username and avatar for the UI.
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username avatar") 
      .sort({ createdAt: -1 }); // Newest comments first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// Controller to handle updates to an existing comment

export const handleCommentEdits = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Update the comment text and return the updated document
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    ).populate("user", "username avatar");

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// Controller to add a new comment to a video

export const addComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;
    const userId = req.user.id;

    if (!text || !videoId) {
      return res.status(400).json({ message: "Text and Video ID are required" });
    }

    const newComment = new Comment({
      text,
      video: videoId,
      user: userId,
    });

    const savedComment = await newComment.save();
    
    // Populate user to return full object immediately
    await savedComment.populate("user", "username avatar");

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Controller to delete a comment, with ownership verification


export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};