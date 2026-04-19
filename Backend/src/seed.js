import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import Channel from "./models/channelModel.js";
import Video from "./models/videoModel.js";
import Comment from "./models/commentModel.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Connected to MongoDB for seeding...");

    // 1. Clear existing data
    await Comment.deleteMany({});
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});
    console.log("🧹 Cleared existing database.");

    const users = [];
    const channels = [];
    const videos = [];

    // Common credentials for testing
    const commonPassword = await bcrypt.hash("password123", 10);
    const commonDeleteKey = await bcrypt.hash("key123", 10);

    // 2. Create 5 Users
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        username: `User_${i}`,
        email: `user${i}@example.com`,
        password: commonPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User_${i}`,
      });
      users.push(user);
    }
    console.log("api Created 5 Users.");

    // 3. Create 5 Channels (1 per User)
    for (let i = 0; i < 5; i++) {
      const user = users[i];
      const channel = await Channel.create({
        channelName: `Channel ${i + 1} (User ${i + 1})`,
        description: `This is the official channel for User ${i + 1}. Expect great content!`,
        channelBanner: `https://picsum.photos/seed/channel_${i + 1}/1200/300`,
        owner: user._id,
        uniqueDeleteKey: commonDeleteKey,
        subscribers: Math.floor(Math.random() * 1000) + 100,
      });
      channels.push(channel);

      // Update user with their channel reference (assuming User model has a 'channel' field)
      user.channel = channel._id;
      await user.save();
    }
    console.log("api Created 5 Channels (1 per user).");
    let categories=[ "Music", 
    "Gaming", 
    "Education", 
    "Technology", 
    "Travel", 
    "Vlog", 
    "News"]
    // 4. Create 30 Videos (6 per Channel)
    for (let i = 0; i < 5; i++) {
      const channel = channels[i];
      const uploader = users[i];

      for (let j = 1; j <= 6; j++) {
        const video = await Video.create({
          title: `Video ${j} of Channel ${i + 1}`,
          description: `This is video number ${j} uploaded by ${uploader.username} on ${channel.channelName}.`,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
          thumbnailUrl: `https://picsum.photos/seed/video_${i}_${j}/640/360`,
          category: categories[j % categories.length],
          views: Math.floor(Math.random() * 5000),
          likes: Math.floor(Math.random() * 500),
          dislikes: Math.floor(Math.random() * 50),
          channel: channel._id,
          uploader: uploader._id,
        });
        videos.push(video);
      }
    }
    console.log("api Created 30 Videos (6 per channel).");

    // 5. Create Comments (5 per Video, 1 from each User)
    const commentDocs = [];
    for (const video of videos) {
      for (const user of users) {
        commentDocs.push({
          text: `Nice video! Comment from ${user.username}.`,
          video: video._id,
          user: user._id,
        });
      }
    }
    await Comment.insertMany(commentDocs);
    console.log(`api Created ${commentDocs.length} Comments (5 per video).`);

    console.log("✨ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();