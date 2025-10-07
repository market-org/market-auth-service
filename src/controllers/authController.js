import User from "../models/Users.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: "Bitte alle Felder ausfüllen" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert" });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
    });

    res.status(201).json({
      message: "✅ Benutzer erfolgreich registriert",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("❌ Fehler bei Registrierung:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
};


// 🔹 Benutzer Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Benutzer suchen
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "❌ Benutzer nicht gefunden" });
    }

    // Passwort prüfen
    const bcrypt = await import("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Falsches Passwort" });
    }

    // ✅ Erfolg – wir geben nur eine Nachricht und Name/Email zurück
    res.status(200).json({
      message: "✅ Login erfolgreich",
      user: {
        name: user.name,
        email: user.email,
      },
      hint: "Bitte sende den Benutzernamen im Header bei weiteren Anfragen",
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Serverfehler", error: error.message });
  }
};
