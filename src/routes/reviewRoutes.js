import express from "express";
import { checkUserHeader } from "../middleware/checkUserHeader.js";
import { addReview, getReviewsForSeller } from "../controllers/reviewController.js";

const router = express.Router();

// ➕ add a new review for a seller  
router.post("/:sellerId", checkUserHeader, addReview);

// 📄  show all reviews for a seler 
router.get("/:sellerId", getReviewsForSeller);

export default router;
