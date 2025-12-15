import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
//

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

import authRoutes from "./src/auth/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(cookieParser());
app.use(express.json());

/* API routes FIRST */
app.use("/auth", authRoutes);

/* Serve frontend */
app.use(express.static(path.join(__dirname, "dist")));

/* SPA fallback — Express 5 compatible */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB:", err);
    process.exit(1);
  });
