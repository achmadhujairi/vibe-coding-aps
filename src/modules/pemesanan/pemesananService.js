const dataStore = require("../../database/dataStore");

/**
 * Service untuk Pemesanan dan Pembatalan Tiket Pesawat
 * Mencakup US-02 (b, c) & US-06 (c)
 */
class PemesananService {
  getAllPemesanan() {
    return dataStore.data.pemesanan;
  }

  getPemesananById(idPemesanan) {
    return dataStore.data.pemesanan.find((p) => p.idPemesanan === idPemesanan);
  }

  getPemesananByPengguna(idPengguna) {
    return dataStore.data.pemesanan.filter((p) => p.idPengguna === idPengguna);
  }

  /**
   * Task b (US-02 & US-06): Memesan tiket pesawat
   */
  pesanTiket({ idPengguna, idTiket, namaPenumpang, emailPenumpang }) {
    const tiket = dataStore.data.tiket.find((t) => t.idTiket === idTiket);
    if (!tiket) {
      return { success: false, status: "TIKET_NOT_FOUND", message: "Tiket tidak ditemukan" };
    }

    if (tiket.statusTiket !== "Tersedia") {
      return {
        success: false,
        status: "TIKET_UNAVAILABLE",
        message: `Tiket dengan status '${tiket.statusTiket}' tidak dapat dipesan`
      };
    }

    const penerbangan = dataStore.data.penerbangan.find(
      (p) => p.idPenerbangan === tiket.idPenerbangan
    );

    const bookingRefRandom = Math.floor(1000 + Math.random() * 9000);
    const idPemesanan = `ORD-${Date.now().toString().slice(-6)}`;
    const kodeBookingReference = `BOOK-REF-${bookingRefRandom}`;

    const newOrder = {
      idPemesanan,
      idPengguna: idPengguna || "USR-GUEST",
      idTiket,
      tanggalPemesanan: new Date().toISOString().split("T")[0],
      statusBooking: "booked",
      kodeBookingReference,
      penumpang: {
        nama: namaPenumpang || "Nama Penumpang",
        email: emailPenumpang || "email@penumpang.com"
      },
      detailPenerbangan: penerbangan
        ? {
            asal: penerbangan.asal,
            tujuan: penerbangan.tujuan,
            tanggal: penerbangan.tanggal,
            jamKeberangkatan: penerbangan.jamKeberangkatan,
            harga: tiket.harga
          }
        : null
    };

    // Update status tiket
    tiket.statusTiket = "Dipesan";
    dataStore.data.pemesanan.push(newOrder);

    return {
      success: true,
      status: "ORDER_CREATED",
      message: "Tiket berhasil dipesan",
      data: newOrder
    };
  }

  /**
   * Task c (US-02): Membatalkan tiket pesawat yang diinginkan
   */
  batalkanTiket(idPemesanan, alasan = "Permintaan Pembatalan Pengguna") {
    const order = this.getPemesananById(idPemesanan);
    if (!order) {
      return { success: false, status: "ORDER_NOT_FOUND", message: "Pesanan tidak ditemukan" };
    }

    if (order.statusBooking === "cancelled") {
      return {
        success: false,
        status: "ALREADY_CANCELLED",
        message: "Pesanan ini sudah dibatalkan sebelumnya"
      };
    }

    // Set order status to cancelled
    order.statusBooking = "cancelled";

    // Set tiket back to Tersedia
    const tiket = dataStore.data.tiket.find((t) => t.idTiket === order.idTiket);
    if (tiket) {
      tiket.statusTiket = "Tersedia";
    }

    const pembatalanRecord = {
      idPembatalan: `CANC-${Date.now().toString().slice(-6)}`,
      idPemesanan: order.idPemesanan,
      tanggalPembatalan: new Date().toISOString(),
      alasan
    };
    dataStore.data.pembatalan.push(pembatalanRecord);

    return {
      success: true,
      status: "CANCEL_SUCCESS",
      message: "Pesanan tiket berhasil dibatalkan",
      data: {
        pemesanan: order,
        pembatalan: pembatalanRecord
      }
    };
  }
}

module.exports = new PemesananService();
