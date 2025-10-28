import Review from "../models/Review.js";
import User from "../models/Users.js";

/**
 * ➕ Add a new review (authenticated route)
 */
export const addReview = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { rating, comment } = req.body;

    const reviewer = req.user;

    if (!reviewer) {
      return res.status(401).json({ message: "❌ Zugriff verweigert – bitte logge dich zuerst ein." });
    }

    // 🚫 You cannot review yourself
    if (reviewer._id.toString() === sellerId) {
      return res.status(400).json({ message: "❌ Du kannst dich nicht selbst bewerten." });
    }

    // 🔍 Check if the reviewer has already reviewed this seller
    const existingReview = await Review.findOne({
      reviewer: reviewer._id,
      seller: sellerId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "❌ Du hast diesen Verkäufer bereits bewertet.",
      });
    }

    // ✅ Make sure the seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "❌ Verkäufer nicht gefunden." });
    }

    // 💾 Create the review
    const review = await Review.create({
      reviewer: reviewer._id,
      seller: sellerId,
      rating,
      comment,
    });

    // 🧮 Recalculate stats
    const reviews = await Review.find({ seller: sellerId });
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = reviews.length ? total / reviews.length : 0;

    seller.ratingAverage = Number(average.toFixed(2));
    seller.ratingCount = reviews.length;
    await seller.save();

    // ✅ Return updated seller directly
    const updatedSeller = await User.findById(sellerId).select("name email city ratingAverage ratingCount");

    res.status(201).json({
      message: "✅ Bewertung hinzugefügt und Verkäufer aktualisiert.",
      review,
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("❌ Fehler beim Hinzufügen der Bewertung:", error);
    res.status(500).json({ message: "❌ Fehler beim Hinzufügen der Bewertung", error: error.message });
  }
};

/**
 * 📄 Display reviews for a specific seller
 */
export const getReviewsForSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const reviews = await Review.find({ seller: sellerId })
      .populate("reviewer", "name city")
      .sort({ createdAt: -1 });

    res.json({
      message: "📄 Bewertungen des Verkäufers.",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Bewertungen:", error);
    res.status(500).json({ message: "❌ Fehler beim Abrufen der Bewertungen", error: error.message });
  }
};

/**
 * ➕ Add review directly from Ads-Service (no auth header)
 */
export const addReviewFromAdsService = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({ message: "❌ userId and rating are required." });
    }

    // 🚫 User can't review himself
    if (userId === sellerId) {
      return res.status(400).json({ message: "❌ You cannot rate yourself." });
    }

    // ✅ Check if seller exists
    const seller = await User.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "❌ Seller not found." });

    // 🚫 Check if already reviewed by same user
    const existing = await Review.findOne({ reviewer: userId, seller: sellerId });
    if (existing) {
      return res.status(400).json({ message: "❌ You already rated this seller." });
    }

    // 💾 Create review
    const review = await Review.create({ reviewer: userId, seller: sellerId, rating, comment });

    // 🧮 Recalculate stats
    const reviews = await Review.find({ seller: sellerId });
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = reviews.length ? total / reviews.length : 0;

    seller.ratingAverage = Number(average.toFixed(2));
    seller.ratingCount = reviews.length;
    await seller.save();

    // ✅ Return updated seller directly
    const updatedSeller = await User.findById(sellerId).select("name email city ratingAverage ratingCount");

    res.status(201).json({
      message: "✅ Review added from Ads-Service and seller updated.",
      review,
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("❌ addReviewFromAdsService error:", error);
    res.status(500).json({
      message: "❌ Error adding review from Ads-Service",
      error: error.message,
    });
  }
};
