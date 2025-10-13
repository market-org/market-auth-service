import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userPublicRoutes from "./routes/userPublicRoutes.js";



const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
connectDB();
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/users", userPublicRoutes); // Public user routes
app.get("/", (_req, res) => {
  res.send("✅ MARKET Auth-Service läuft mit MongoDB");
});

app.listen(PORT, () => {
  console.log(`Auth-Service läuft auf http://localhost:${PORT}`);
});

