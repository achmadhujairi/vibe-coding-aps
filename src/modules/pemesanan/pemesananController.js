const pemesananService = require("./pemesananService");

/**
 * Controller untuk Pemesanan & Pembatalan Tiket (US-02 & US-06)
 * Sesuai Pemesanan Tiket Controller & Pembatalan Tiket Controller
 */
class PemesananController {
  getAllPemesanan(req, res) {
    try {
      const { idPengguna } = req.query;
      let data;
      if (idPengguna) {
        data = pemesananService.getPemesananByPengguna(idPengguna);
      } else {
        data = pemesananService.getAllPemesanan();
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  getPemesananById(req, res) {
    try {
      const { idPemesanan } = req.params;
      const data = pemesananService.getPemesananById(idPemesanan);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Pesanan dengan ID ${idPemesanan} tidak ditemukan`
        });
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  pesanTiket(req, res) {
    try {
      const { idPengguna, idTiket, namaPenumpang, emailPenumpang } = req.body;
      if (!idTiket) {
        return res.status(400).json({
          success: false,
          message: "Field 'idTiket' wajib diisi untuk melakukan pemesanan"
        });
      }

      const hasil = pemesananService.pesanTiket({
        idPengguna,
        idTiket,
        namaPenumpang,
        emailPenumpang
      });

      if (!hasil.success) {
        return res.status(400).json(hasil);
      }

      return res.status(201).json(hasil);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  batalkanTiket(req, res) {
    try {
      const { idPemesanan } = req.params;
      const { alasan } = req.body;

      const hasil = pemesananService.batalkanTiket(idPemesanan, alasan);
      if (!hasil.success) {
        return res.status(400).json(hasil);
      }

      return res.status(200).json(hasil);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new PemesananController();
