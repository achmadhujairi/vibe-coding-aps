const travelService = require("./travelService");

/**
 * Controller untuk Travel Manager & Otorisasi
 * Mencakup US-07, US-08, US-09
 * Sesuai:
 * - Otorisasi Travel Controller (US-07)
 * - Pemesanan Tiket Pengunjung & Pengiriman E-Tiket Controller (US-08)
 * - Otorisasi Tiket Controller (US-09)
 */
class TravelController {
  getStatusBooking(req, res) {
    try {
      const { status } = req.query;
      const data = travelService.getStatusBookingList(status);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  pesanTiketPengunjung(req, res) {
    try {
      const { idTiket, namaPengunjung, emailPengunjung } = req.body;
      const hasil = travelService.pesanTiketPengunjung({
        idTiket,
        namaPengunjung,
        emailPengunjung
      });

      if (!hasil.success) {
        return res.status(400).json(hasil);
      }

      return res.status(201).json(hasil);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  getTiketPengunjung(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Parameter 'email' pengunjung wajib disertakan"
        });
      }

      const data = travelService.getTiketPengunjung(email);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  otorisasiTiket(req, res) {
    try {
      const { kodeBookingReference } = req.body;
      const hasil = travelService.otorisasiTiket(kodeBookingReference);

      if (!hasil.success) {
        // Sesuai AC US-09: Tampilkan pesan "kode booking reference tidak sesuai"
        return res.status(400).json(hasil);
      }

      return res.status(200).json(hasil);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TravelController();
