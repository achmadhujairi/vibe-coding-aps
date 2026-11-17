const profilService = require("./profilService");

/**
 * Controller untuk Profil dan Validasi Tiket (US-05)
 * Sesuai Profil Controller & Validasi Tiket Controller
 */
class ProfilController {
  getAllMembers(req, res) {
    try {
      const data = profilService.getAllMembers();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  getMemberDetail(req, res) {
    try {
      const { idMember } = req.params;
      const data = profilService.getMember(idMember);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Member dengan ID ${idMember} tidak ditemukan`
        });
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  updateProfil(req, res) {
    try {
      const { idMember } = req.params;
      const dataUpdate = req.body;

      const hasil = profilService.updateProfil(idMember, dataUpdate);
      if (!hasil) {
        return res.status(404).json({
          success: false,
          message: `Member dengan ID ${idMember} tidak ditemukan`
        });
      }

      return res.status(200).json({
        success: true,
        message: "Data profil berhasil diperbarui",
        data: hasil
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  validasiTiket(req, res) {
    try {
      const { idMember, idTiket } = req.body;
      if (!idMember || !idTiket) {
        return res.status(400).json({
          success: false,
          message: "Field 'idMember' dan 'idTiket' wajib diisi"
        });
      }

      const hasil = profilService.validasiTiket(idMember, idTiket);

      if (!hasil.success) {
        if (hasil.status === "PROFIL_TIDAK_LENGKAP") {
          return res.status(422).json(hasil); // Unprocessable Entity
        }
        return res.status(404).json(hasil);
      }

      return res.status(200).json(hasil);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ProfilController();
