import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByUsername, findAdminById, updateAdminPassword } from "../models/adminModel.js";

const MIN_PASSWORD_LENGTH = 8;

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please provide both username and password." });
    }

    const admin = await findAdminByUsername(username);

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials: Admin user not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials: Incorrect password." });
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET || "vimanra_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Authentication successful.",
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during authentication." });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return res.status(200).json({ admin: req.user });
};

// @desc    Change the signed-in admin's password
// @route   PUT /api/auth/password
// @access  Private (Admin)
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ message: "Both the current and new password are required." });
    }

    if (new_password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    if (new_password === current_password) {
      return res
        .status(400)
        .json({ message: "The new password must differ from the current one." });
    }

    // Read from the token rather than the body, so one admin cannot aim this
    // at another account by passing a different id.
    const admin = await findAdminById(req.user.admin_id);
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    const isMatch = await bcrypt.compare(current_password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Your current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(new_password, 10);
    await updateAdminPassword(admin.admin_id, passwordHash);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ message: "Server error while updating the password." });
  }
};
