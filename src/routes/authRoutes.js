import express from "express";
import { registerUser, loginUser, verifyUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);

export default router;
