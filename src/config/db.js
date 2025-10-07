import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB verbunden!");
  } catch (err) {
    console.error("❌ MongoDB Verbindung fehlgeschlagen:", err.message);
    process.exit(1);
  }
};
