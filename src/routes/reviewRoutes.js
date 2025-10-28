import express from "express";
import { checkUserHeader } from "../middleware/checkUserHeader.js";
import { addReview, getReviewsForSeller } from "../controllers/reviewController.js";

const router = express.Router();

// ⭐ allow Ads-Service to rate seller without login header (using userId in body)
import { addReviewFromAdsService } from "../controllers/reviewController.js";
router.post("/from-ads/:sellerId", addReviewFromAdsService);



// ➕ add a new review for a seller  
router.post("/:sellerId", checkUserHeader, addReview);




// 📄  show all reviews for a seler 
router.get("/:sellerId", getReviewsForSeller);

export default router;
