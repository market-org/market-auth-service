import express from "express";
import { checkUserHeader } from "../middleware/checkUserHeader.js";

const router = express.Router();

// Beispiel: geschützte Route
router.get("/profile", checkUserHeader, (req, res) => {
  res.json({
    message: "✅ Zugriff erlaubt",
    user: {
      name: req.user.name,
      email: req.user.email,
    },
  });
});

export default router;
