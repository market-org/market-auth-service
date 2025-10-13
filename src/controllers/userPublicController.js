import mongoose from "mongoose";
import User from "../models/Users.js";

// 🔍 Öffentliche Benutzerinfo per ID abrufen (für andere Services)
export const getPublicUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ تحقق من صلاحية الـ ObjectId قبل أي استعلام
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Ungültige Benutzer-ID" });
    }

    const user = await User.findById(id).select(
      "name city ratingAverage ratingCount isVerified createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "❌ Benutzer nicht gefunden" });
    }

    res.status(200).json({
      message: "✅ Öffentliche Benutzerinformationen",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Fehler beim Abrufen der Benutzerinformationen",
      error: error.message,
    });
  }
};
