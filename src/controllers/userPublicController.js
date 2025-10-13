import User from "../models/Users.js";

// 🔍 Öffentliche Benutzerinfo per ID abrufen (für andere Services)
export const getPublicUserById = async (req, res) => {
  try {
    const { id } = req.params;

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
