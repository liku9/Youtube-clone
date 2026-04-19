import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

// Validate that all required fields are present in the registration request
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
// Validate email format using regular expression to ensure proper email structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }
// Define password requirements with regex for strong security including uppercase, lowercase, numbers, and special characters
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
      });
    }
// Check if a user with the provided email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already used",
      });
    }

// Hash the user password using bcrypt with salt rounds of 10 for security
    const hashedPassword = await bcrypt.hash(password, 10);

// Create a new user document in the database with the provided information
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

// Send a success response indicating the user was registered successfully
    res.status(201).json({
      message: "User registered successfully. Please login to continue.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default registerController;