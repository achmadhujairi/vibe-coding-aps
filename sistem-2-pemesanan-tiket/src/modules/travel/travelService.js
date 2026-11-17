const dataStore = require("../../database/dataStore");

/**
 * Service untuk Travel Manager (US-07, US-08, US-09)
 */
class TravelService {
  /**
   * US-07: Melihat dan Memfilter Status Booking
   * status: 'confirmed', 'booked', 'waiting for the payment', 'cancelled'
   */
  getStatusBookingList(filterStatus = null) {
    const orders = dataStore.data.pemesanan;
    const allStatuses = ["confirmed", "booked", "waiting for the payment", "cancelled"];

    let filtered = orders;
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(
        (o) => o.statusBooking.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return {
      availableStatuses: allStatuses,
      currentFilter: filterStatus || "all",
      total: filtered.length,
      bookings: filtered
    };
  }

  /**
   * US-08: Pemesanan Tiket untuk Pengunjung oleh Manajer Travel
   * Termasuk penyimpanan data pengunjung, pengaitan tiket, dan penerbitan e-tiket via email
   */
  pesanTiketPengunjung({ idTiket, namaPengunjung, emailPengunjung }) {
    if (!idTiket || !namaPengunjung || !emailPengunjung) {
      return {
        success: false,
        status: "INVALID_DATA",
        message: "Data pengunjung (nama, email) dan idTiket wajib diisi"
      };
    }

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

    // Cari atau buat pengunjung baru
    let pengunjung = dataStore.data.pengunjung.find((p) => p.email === emailPengunjung);
    if (!pengunjung) {
      pengunjung = {
        idPengunjung: `GST-${Date.now().toString().slice(-4)}`,
        nama: namaPengunjung,
        email: emailPengunjung
      };
      dataStore.data.pengunjung.push(pengunjung);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const idPemesanan = `ORD-GST-${Date.now().toString().slice(-5)}`;
    const kodeBookingReference = `BOOK-REF-${randomSuffix}`;

    const penerbangan = dataStore.data.penerbangan.find(
      (p) => p.idPenerbangan === tiket.idPenerbangan
    );

    const newOrder = {
      idPemesanan,
      idPengguna: pengunjung.idPengunjung,
      idTiket,
      tanggalPemesanan: new Date().toISOString().split("T")[0],
      statusBooking: "confirmed",
      kodeBookingReference,
      penumpang: {
        nama: pengunjung.nama,
        email: pengunjung.email
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

    // Tandai tiket dipesan
    tiket.statusTiket = "Dipesan";
    dataStore.data.pemesanan.push(newOrder);

    // Pengiriman E-Tiket ke email (Task d)
    const emailRecord = {
      idEmail: `EML-${Date.now().toString().slice(-5)}`,
      idPemesanan,
      alamatEmail: pengunjung.email,
      statusPengiriman: "TERKIRIM",
      waktuKirim: new Date().toISOString(),
      eTiketData: {
        kodeBooking: kodeBookingReference,
        namaPenumpang: pengunjung.nama,
        penerbangan: newOrder.detailPenerbangan
      }
    };
    dataStore.data.emailETiket.push(emailRecord);

    return {
      success: true,
      status: "SUCCESS",
      message: "Tiket penerbangan pengunjung berhasil dipesan dan e-tiket telah dikirimkan ke email",
      data: {
        pengunjung,
        pemesanan: newOrder,
        eTiket: emailRecord
      }
    };
  }

  /**
   * US-08 (Task c): Pengunjung melihat daftar tiket yang terpesan di akunnya
   */
  getTiketPengunjung(email) {
    const orders = dataStore.data.pemesanan.filter(
      (o) => o.penumpang && o.penumpang.email.toLowerCase() === email.toLowerCase()
    );
    const emails = dataStore.data.emailETiket.filter(
      (e) => e.alamatEmail.toLowerCase() === email.toLowerCase()
    );

    return {
      email,
      totalPesanan: orders.length,
      pesanan: orders,
      eTiketTerkirim: emails
    };
  }

  /**
   * US-09: Otorisasi Tiket Pesawat Berdasarkan Kode Booking Reference
   * Task a: Sukses jika kode cocok -> sistem menampilkan status booking tiket.
   * Task b: Gagal jika kode tidak sesuai -> sistem menampilkan pesan "kode booking reference tidak sesuai".
   */
  otorisasiTiket(kodeBookingReference) {
    if (!kodeBookingReference || typeof kodeBookingReference !== "string") {
      return {
        success: false,
        status: "INVALID_INPUT",
        message: "kode booking reference tidak sesuai",
        instruksi: "Silakan periksa dan ulangi input kode booking reference Anda."
      };
    }

    const trimmedCode = kodeBookingReference.trim().toUpperCase();
    const order = dataStore.data.pemesanan.find(
      (p) => p.kodeBookingReference.toUpperCase() === trimmedCode
    );

    if (!order) {
      return {
        success: false,
        status: "CODE_NOT_FOUND",
        message: "kode booking reference tidak sesuai",
        instruksi: "Mohon ulangi input kode booking reference yang valid."
      };
    }

    return {
      success: true,
      status: "AUTHORIZED",
      message: "Otorisasi tiket berhasil diverifikasi",
      data: {
        kodeBookingReference: order.kodeBookingReference,
        statusBooking: order.statusBooking,
        idPemesanan: order.idPemesanan,
        penumpang: order.penumpang,
        tanggalPemesanan: order.tanggalPemesanan,
        detailPenerbangan: order.detailPenerbangan
      }
    };
  }
}

module.exports = new TravelService();
