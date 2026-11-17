const express = require("express");
const path = require("path");
const cors = require("cors");

// Routes
const cutiRoutes = require("./modules/cuti/cutiRoutes");
const penerbanganRoutes = require("./modules/penerbangan/penerbanganRoutes");
const profilRoutes = require("./modules/profil/profilRoutes");
const pemesananRoutes = require("./modules/pemesanan/pemesananRoutes");
const travelRoutes = require("./modules/travel/travelRoutes");

const app = express();

// Security: Disable X-Powered-By to prevent framework version disclosure (SonarQube S5689)
app.disable("x-powered-by");

// Middlewares: Secure CORS origins (SonarQube S5122)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend UI
app.use(express.static(path.join(__dirname, "public")));

// API Endpoints
app.use("/api/cuti", cutiRoutes);
app.use("/api/penerbangan", penerbanganRoutes);
app.use("/api/profil", profilRoutes);
app.use("/api/pemesanan", pemesananRoutes);
app.use("/api/travel", travelRoutes);

// Health check & Meta
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    service: "Vibe Coding APS - Sistem Cuti & Pemesanan Tiket",
    author: "Achmad Hujairi (255150200111042)"
  });
});

// 404 Handler for API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
