import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./src/auth/routes.js";

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

mongoose
  .connect(
    "mongodb+srv://munna-bhai:H6H4IcSYXbsk1zZ8@first-cluster.ljcmp.mongodb.net/Notes"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`CORS allowing origin: http://localhost:5173`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB:", err);
    process.exit(1);
  });
