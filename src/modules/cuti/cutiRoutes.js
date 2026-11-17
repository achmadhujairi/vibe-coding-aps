const express = require("express");
const router = express.Router();
const cutiController = require("./cutiController");

// Endpoint Pengelolaan Cuti (US-01)
router.get("/pegawai", (req, res) => cutiController.getAllPegawai(req, res));
router.get("/pengajuan", (req, res) => cutiController.getPengajuanCuti(req, res));
router.get("/pegawai/:idPegawai/detail", (req, res) => cutiController.getDetailPegawaiCuti(req, res));
router.post("/pengajuan", (req, res) => cutiController.ajukanCuti(req, res));

module.exports = router;
