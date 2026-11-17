const express = require("express");
const router = express.Router();
const controller = require("./pemesananController");

// US-02 & US-06: Pemesanan & Pembatalan Tiket
router.get("/", (req, res) => controller.getAllPemesanan(req, res));
router.get("/:idPemesanan", (req, res) => controller.getPemesananById(req, res));
router.post("/pesan", (req, res) => controller.pesanTiket(req, res));
router.post("/:idPemesanan/batalkan", (req, res) => controller.batalkanTiket(req, res));

module.exports = router;
