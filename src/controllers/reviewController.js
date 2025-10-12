import Review from "../models/Review.js";
import User from "../models/Users.js";

// ➕ Add a new review
export const addReview = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { rating, comment } = req.body;

    // The user who sent the request (the reviewer)
    const reviewer = req.user;

    if (!reviewer) {
      return res.status(401).json({ message: "❌ Zugriff verweigert bitte login zuerst" });
    }

    // You cannot review yourself
    if (reviewer._id.toString() === sellerId) {
      return res.status(400).json({ message: "❌ Du kannst dich nicht selbst bewerten" });
    }

    // Check if the reviewer has already reviewed this seller
    const existingReview = await Review.findOne({
      reviewer: reviewer._id,
      seller: sellerId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "❌ Du hast diesen Verkäufer bereits bewertet",
      });
    }


    // Make sure the seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "❌ Verkäufer nicht gefunden" });
    }

    // Create the review
    const review = await Review.create({
      reviewer: reviewer._id,
      seller: sellerId,
      rating,
      comment,
    });

    // Update seller’s rating (average and count)
    const stats = await Review.aggregate([
      { $match: { seller: seller._id } },
      {
        $group: {
          _id: "$seller",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      seller.ratingAverage = stats[0].avgRating;
      seller.ratingCount = stats[0].count;
    } else {
      seller.ratingAverage = 0;
      seller.ratingCount = 0;
    }
    await seller.save();

    res.status(201).json({
      message: "✅ Bewertung hinzugefügt",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Hinzufügen der Bewertung", error: error.message });
  }
};

// 📄 Display reviews for a specific seller
export const getReviewsForSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const reviews = await Review.find({ seller: sellerId })
      .populate("reviewer", "name city")
      .sort({ createdAt: -1 });

    res.json({
      message: "📄 Bewertungen des Verkäufers",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Abrufen der Bewertungen", error: error.message });
  }
};
