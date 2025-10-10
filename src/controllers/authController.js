import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";


// Register new user
// generate verification code for email confirmation 


// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************



export const registerUser = async (req, res) => {
 
  try {
    const { name, email, password, city, birthday } = req.body;

    if (!name || !email || !password || !city || !birthday) {
      return res.status(400).json({ message: "Bitte alle Felder ausfüllen: name, email, password, city, birthday" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert" });
    }

    
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const verificationCodeExpires = Date.now() + 60 * 60 * 1000; // 1 Stunde gültig
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
      birthday,
      verificationCode,
      verificationCodeExpires
    });
  
    // Send verification email
    const html = `
  <h2>Willkommen bei MARKET!</h2>
  <p>Dein Verifizierungscode lautet:</p>
  <h3>${verificationCode}</h3>
  <p>Gib diesen Code in der App ein, um dein Konto zu bestätigen.</p>
`;

    await sendEmail(email, "MARKET – Dein Verifizierungscode", html);

    res.status(201).json({
      message: "✅ Benutzer erfolgreich registriert",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("❌ Fehler bei Registrierung:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
};


// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************


// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // select password explicitly
    if (!user) {
      return res.status(404).json({ message: "❌ Benutzer nicht gefunden" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Falsches Passwort" });
    }

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
// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************

// Get current user profile (without password)
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "❌ Zugriff verweigert. Kein Benutzer gefunden." });
    }

    //show user without password 
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      message: "📄 Benutzerprofil",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        birthday: user.birthday,
        isVerified: user.isVerified,
        ratingAverage: user.ratingAverage,
        ratingCount: user.ratingCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Fehler beim Abrufen des Profils",
      error: error.message,
    });
  }
};

// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************


// Update current user profile (only name and city and birthday)
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "❌ Zugriff verweigert. Kein Benutzer gefunden." });
    }

    const { name, city, birthday } = req.body;

    // Check if there are fields to update
    if (!name && !city && !birthday) {
      return res.status(400).json({ message: "Please provide at least one field to update (name or city or birthday)" });
    }

    // Update allowed fields only
    if (name) req.user.name = name;
    if (city) req.user.city = city;
    if (birthday) req.user.birthday = birthday;

    // Save updated user
    await req.user.save();

    res.json({
      message: "✅ Profil erfolgreich aktualisiert",
      user: req.user.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Fehler beim Aktualisieren des Profils",
      error: error.message,
    });
  }
};


// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************


// Change user password
export const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "❌ Zugriff verweigert. Kein Benutzer gefunden." });
    }

    const { oldPassword, newPassword } = req.body;

    // Check if both passwords are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both oldPassword and newPassword" });
    }

    // Fetch user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "❌ Benutzer nicht gefunden" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Altes Passwort ist falsch" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save new password
    await user.save();

    res.json({
      message: "✅ Passwort erfolgreich geändert",
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Fehler beim Ändern des Passworts",
      error: error.message,
    });
  }
};

// ****************************************************************************************************************
// ****************************************************************************************************************
// ****************************************************************************************************************

export const verifyUser = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Benutzer nicht gefunden" });

  if (user.isVerified)
    return res.status(400).json({ message: "Benutzer bereits bestätigt" });

  if (
    user.verificationCode !== code ||
    user.verificationCodeExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Ungültiger oder abgelaufener Code" });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res.json({ message: "✅ Konto erfolgreich bestätigt" });
};

