import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Extract email and password from the request body for authentication

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // find user and explicitly include password
    const user = await User.findOne({ email })
      .select("+password")
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

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Compare the provided password with the stored hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Generate a JWT token for the authenticated user session with 15 minute expiration
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        likedVideos:user.likedVideos,
        dislikedVideos:user.dislikedVideos,
        watchHistory:user.watchHistory,
        channel:user.channel,
        subscribedChannels:user.subscribedChannels,
        watchLater: user.watchLater
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default loginController;