const express = require("express");
const router = express.Router();
const controller = require("./travelController");

// US-07: Lihat dan filter status booking
router.get("/status-booking", (req, res) => controller.getStatusBooking(req, res));

// US-08: Pemesanan tiket untuk pengunjung dan cek tiket akun pengunjung
router.post("/pesan-pengunjung", (req, res) => controller.pesanTiketPengunjung(req, res));
router.get("/tiket-pengunjung", (req, res) => controller.getTiketPengunjung(req, res));

// US-09: Otorisasi tiket pesawat via kode booking reference
router.post("/otorisasi-tiket", (req, res) => controller.otorisasiTiket(req, res));

module.exports = router;
