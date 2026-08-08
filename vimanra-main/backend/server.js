import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initTables } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import thingToDoRoutes from "./routes/thingToDoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "12mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/things-to-do", thingToDoRoutes);

// Healthcheck Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "Vimanra Hotel Admin & Website API",
    version: "1.0.0",
    endpoints: [
      "/api/auth/login",
      "/api/services",
      "/api/gallery",
      "/api/reviews",
      "/api/rooms",
      "/api/enquiries",
      "/api/things-to-do",
    ],
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ message: "Internal server error.", error: err.message });
});

// Initialize database and start server
initTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Vimanra Express Server running at http://localhost:${PORT}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`⚠️ Port ${PORT} busy, retrying on http://localhost:5001...`);
        app.listen(5001, () => {
          console.log(`🚀 Vimanra Express Server running at http://localhost:5001`);
        });
      } else {
        console.error("Server listen error:", err);
      }
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });
export default app;