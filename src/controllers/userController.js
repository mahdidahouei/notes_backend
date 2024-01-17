// src/controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, fullName });

    newUser.createdAt = newUser.updatedAt = Date.now();

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKKEN_EXPIRE_TIME,
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKKEN_EXPIRE_TIME,
      }
    );

    const fullName = user.fullName;

    res.json({ accessToken, refreshToken, fullName });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: prevRefreshToken } = req.body;

    // Check if refresh token is valid
    const decoded = jwt.verify(prevRefreshToken, process.env.JWT_SECRET);

    // Find user by ID or other identifier in the decoded token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKKEN_EXPIRE_TIME,
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKKEN_EXPIRE_TIME,
      }
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Refresh token failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, fullName } = req.body;

    // Get the user ID from the token
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (user.username != username) {
      // Check if the new username already exists
      const existingUser = await User.findOne({
        username: username, // Exclude the current user from the check
      });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message: "Username already exists. Choose a different one.",
          });
      }
    }

    await User.findByIdAndUpdate(
      userId,
      { $set: { username, fullName, updatedAt: Date.now() } },
      { new: true }
    );

    res.json("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get the user ID from the token
    const userId = req.user.userId;

    const user = await User.findById(userId);

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.updatedAt = Date.now();

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.json({ available: false, message: 'Username not available' });
    } else {
      res.json({ available: true, message: 'Username available' });
    }
  } catch (error) {
    console.error('Check username availability failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, refreshToken, updateUser, updatePassword, checkUsernameAvailability };
