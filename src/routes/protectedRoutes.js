import express from "express";
import { checkUserHeader } from "../middleware/checkUserHeader.js";
import { getProfile, updateProfile, changePassword } from "../controllers/authController.js";

const router = express.Router();

// Protected route: get current user profile
router.get("/profile", checkUserHeader, getProfile);

// Protected route: update user profile (only name and city)
router.put("/profile", checkUserHeader, updateProfile);

// Protected route: change user password
router.patch("/password", checkUserHeader, changePassword);

export default router;
