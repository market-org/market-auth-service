import express from "express";
import { getPublicUserById } from "../controllers/userPublicController.js";

const router = express.Router();

// 🧭 Public route to get user info by ID
router.get("/:id", getPublicUserById);

export default router;
