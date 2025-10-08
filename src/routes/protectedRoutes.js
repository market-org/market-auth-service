import express from "express";
import { checkUserHeader } from "../middleware/checkUserHeader.js";
import { getProfile, updateProfile } from "../controllers/authController.js";

const router = express.Router();

// Protected route: get current user profile
router.get("/profile", checkUserHeader, getProfile);

// Protected route: update user profile (only name and city)
router.put("/profile", checkUserHeader, updateProfile);

export default router;
