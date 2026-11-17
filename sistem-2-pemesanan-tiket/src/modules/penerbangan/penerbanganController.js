const penerbanganService = require("./penerbanganService");

/**
 * Controller untuk Pencarian dan Perbandingan Penerbangan
 * Sesuai Robustness & Sequence Diagram:
 * - Pencarian Penerbangan Controller (US-02)
 * - Pencarian Beberapa Tujuan Controller (US-03)
 * - Pencarian Multi-Destinasi Controller (US-04)
 * - Perbandingan Harga Controller (US-06)
 */
class PenerbanganController {
  cariPenerbangan(req, res) {
    try {
      const { asal, tujuan, tanggal } = req.query;
      const data = penerbanganService.cariPenerbangan({ asal, tujuan, tanggal });
      return res.status(200).json({
        success: true,
        message: "Data penerbangan berhasil ditemukan",
        total: data.length,
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  cariBeberapaTujuan(req, res) {
    try {
      const { tujuan, tanggal } = req.query;
      if (!tujuan) {
        return res.status(400).json({
          success: false,
          message: "Parameter 'tujuan' (pisahkan dengan koma jika lebih dari satu) wajib diisi"
        });
      }

      const data = penerbanganService.cariBeberapaTujuan(tujuan, tanggal);
      return res.status(200).json({
        success: true,
        message: "Daftar penerbangan beberapa tujuan berhasil ditemukan",
        total: data.length,
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  cariMultiDestinasi(req, res) {
    try {
      const { rute } = req.body;
      if (!Array.isArray(rute) || rute.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Rute multi-destinasi harus berupa array rute penerbangan"
        });
      }

      const data = penerbanganService.cariMultiDestinasi(rute);
      return res.status(200).json({
        success: true,
        message: "Penerbangan multi-destinasi berhasil dicari",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  bandingkanPenerbangan(req, res) {
    try {
      const { tujuan, tanggal, jamKeberangkatanMin, sortBy } = req.query;
      const data = penerbanganService.bandingkanPenerbangan({
        tujuan,
        tanggal,
        jamKeberangkatanMin,
        sortBy
      });

      return res.status(200).json({
        success: true,
        message: "Perbandingan jadwal dan harga tiket berhasil dilakukan",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  getAllMaskapai(req, res) {
    try {
      const data = penerbanganService.getAllMaskapai();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new PenerbanganController();
