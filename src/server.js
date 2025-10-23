import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userPublicRoutes from "./routes/userPublicRoutes.js";
import cors from "cors";


const app = express();
// ✅ Allow requests from Next.js frontend
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/users", userPublicRoutes); // Public user routes

app.get("/", (_req, res) => {
  res.send("✅✅✅ MARKET Auth-Service läuft mit MongoDB");
});

const startServer = async () => {
  try {
    await connectDB(); // ← ننتظر الاتصال قبل تشغيل السيرفر
    console.log("✅✅✅ MARKET Auth-Service läuft mit MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Auth-Service läuft auf http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌❌❌ Verbindung zu MongoDB fehlgeschlagen:", error.message);
    process.exit(1);
  }
};

startServer();
