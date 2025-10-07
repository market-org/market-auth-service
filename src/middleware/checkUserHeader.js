import User from "../models/Users.js";


// Middleware: Benutzer aus Header prüfen
export const checkUserHeader = async (req, res, next) => {
  try {
    const username = req.headers["user"]; // Header: user

    if (!username) {
      return res.status(400).json({ message: "❌ Kein Benutzer im Header angegeben" });
    }

    const user = await User.findOne({
      $or: [{ name: username }, { email: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "❌ Benutzer nicht gefunden" });
    }

    // Benutzer speichern für spätere Nutzung
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "❌ Header-Prüfung fehlgeschlagen", error: error.message });
  }
};
