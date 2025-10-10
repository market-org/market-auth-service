import express from "express";
import { checkUserHeader } from "../middleware/checkUserHeader.js";
import { getProfile, updateProfile, changePassword } from "../controllers/authController.js";
import { deleteUser } from "../controllers/adminController.js";

const router = express.Router();




// Protected route: get current user profile
router.get("/profile", checkUserHeader, getProfile);

// Protected route: update user profile (only name and city)
router.put("/profile", checkUserHeader, updateProfile);

// Protected route: change user password
router.patch("/password", checkUserHeader, changePassword);

// Protected route: delete user account by the Admin just the Admin. 
router.delete("/users/:id", checkUserHeader, deleteUser);


export default router;
