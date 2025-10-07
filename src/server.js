import express from "express";

const app = express();
const PORT = process.env.PORT || 5001;

app.get("/", (_req, res) => {
  res.send("✅ MARKET Auth-Service läuft");
});

app.listen(PORT, () => {
  console.log(`Auth-Service on http://localhost:${PORT}`);
});
