const cutiService = require("./cutiService");

/**
 * Controller untuk Sistem 1: Pengelolaan Cuti Pegawai (US-01)
 * Mencakup Cuti Controller & Pegawai Controller
 */
class CutiController {
  getAllPegawai(req, res) {
    try {
      const data = cutiService.getAllPegawai();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  getPengajuanCuti(req, res) {
    try {
      const { tahun, bulan, tanggalMulai, tanggalSelesai } = req.query;
      const data = cutiService.getPengajuanByPeriode({
        tahun,
        bulan,
        tanggalMulai,
        tanggalSelesai
      });

      return res.status(200).json({
        success: true,
        message: "Data pengajuan cuti pegawai berhasil dimuat",
        total: data.length,
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  getDetailPegawaiCuti(req, res) {
    try {
      const { idPegawai } = req.params;
      const { tahun } = req.query;

      const detail = cutiService.getDetailCutiPegawai(idPegawai, tahun || 2026);
      if (!detail) {
        return res.status(404).json({
          success: false,
          message: `Pegawai dengan ID ${idPegawai} tidak ditemukan`
        });
      }

      return res.status(200).json({
        success: true,
        message: "Data riwayat dan sisa cuti pegawai berhasil dimuat",
        data: detail
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  ajukanCuti(req, res) {
    try {
      const { idPegawai, tanggalMulai, tanggalSelesai, durasiCuti, alasan } = req.body;
      if (!idPegawai || !tanggalMulai || !tanggalSelesai || !durasiCuti) {
        return res.status(400).json({
          success: false,
          message: "Data pengajuan cuti tidak lengkap. Harap isi semua field wajib."
        });
      }

      const data = cutiService.ajukanCuti({
        idPegawai,
        tanggalMulai,
        tanggalSelesai,
        durasiCuti,
        alasan
      });

      return res.status(201).json({
        success: true,
        message: "Pengajuan cuti berhasil ditambahkan",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CutiController();
