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
