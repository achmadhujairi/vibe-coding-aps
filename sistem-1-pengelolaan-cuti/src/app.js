const express = require("express");
const path = require("path");
const cors = require("cors");
const cutiRoutes = require("./modules/cuti/cutiRoutes");

const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/cuti", cutiRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "Sistem 1: Pengelolaan Cuti Pegawai (US-01)",
    author: "Achmad Hujairi (255150200111042)"
  });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

module.exports = app;
