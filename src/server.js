import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/protected", protectedRoutes);
app.get("/", (_req, res) => {
  res.send("✅ MARKET Auth-Service läuft mit MongoDB");
});

app.listen(PORT, () => {
  console.log(`Auth-Service läuft auf http://localhost:${PORT}`);
});

