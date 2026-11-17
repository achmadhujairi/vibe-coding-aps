const express = require("express");
const router = express.Router();
const controller = require("./penerbanganController");

// US-02: Cari penerbangan umum
router.get("/cari", (req, res) => controller.cariPenerbangan(req, res));

// US-03: Cari penerbangan beberapa tujuan
router.get("/beberapa-tujuan", (req, res) => controller.cariBeberapaTujuan(req, res));

// US-04: Cari penerbangan multi-destinasi
router.post("/multi-destinasi", (req, res) => controller.cariMultiDestinasi(req, res));

// US-06: Bandingkan penerbangan & harga sesuai preferensi
router.get("/bandingkan", (req, res) => controller.bandingkanPenerbangan(req, res));

// Master maskapai
router.get("/maskapai", (req, res) => controller.getAllMaskapai(req, res));

module.exports = router;
