const express = require("express");
const router = express.Router();
const controller = require("./profilController");

// US-05: Member Profile & Validasi Tiket
router.get("/members", (req, res) => controller.getAllMembers(req, res));
router.get("/members/:idMember", (req, res) => controller.getMemberDetail(req, res));
router.put("/members/:idMember", (req, res) => controller.updateProfil(req, res));
router.post("/validasi-tiket", (req, res) => controller.validasiTiket(req, res));

module.exports = router;
