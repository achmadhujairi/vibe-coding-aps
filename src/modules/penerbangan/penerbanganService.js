const dataStore = require("../../database/dataStore");

/**
 * Service untuk Pencarian dan Perbandingan Penerbangan
 * Mencakup US-02, US-03, US-04, US-06
 */
class PenerbanganService {
  _getEnrichedFlights() {
    const maskapaiMap = new Map(dataStore.data.maskapai.map((m) => [m.idMaskapai, m.namaMaskapai]));
    const tiketMap = new Map(dataStore.data.tiket.map((t) => [t.idPenerbangan, t]));

    return dataStore.data.penerbangan.map((flight) => {
      const tiket = tiketMap.get(flight.idPenerbangan) || { idTiket: null, harga: 0, statusTiket: "Tidak Tersedia" };
      return {
        idPenerbangan: flight.idPenerbangan,
        idMaskapai: flight.idMaskapai,
        namaMaskapai: maskapaiMap.get(flight.idMaskapai) || "Unknown",
        asal: flight.asal,
        tujuan: flight.tujuan,
        tanggal: flight.tanggal,
        jamKeberangkatan: flight.jamKeberangkatan,
        idTiket: tiket.idTiket,
        harga: tiket.harga,
        statusTiket: tiket.statusTiket
      };
    });
  }

  /**
   * US-02 (Task a): Cari jadwal penerbangan sesuai tujuan
   */
  cariPenerbangan({ asal, tujuan, tanggal }) {
    let flights = this._getEnrichedFlights();

    if (tujuan) {
      flights = flights.filter((f) => f.tujuan.toLowerCase().includes(tujuan.toLowerCase()));
    }
    if (asal) {
      flights = flights.filter((f) => f.asal.toLowerCase().includes(asal.toLowerCase()));
    }
    if (tanggal) {
      flights = flights.filter((f) => f.tanggal === tanggal);
    }

    return flights;
  }

  /**
   * US-03: Cari jadwal penerbangan untuk beberapa tujuan penerbangan
   * Input daftarTujuan: array string atau comma-separated string, contoh: ["Bali", "Surabaya"]
   */
  cariBeberapaTujuan(daftarTujuan, tanggal = null) {
    if (!Array.isArray(daftarTujuan)) {
      daftarTujuan = daftarTujuan.split(",").map((t) => t.trim().toLowerCase());
    } else {
      daftarTujuan = daftarTujuan.map((t) => t.trim().toLowerCase());
    }

    let flights = this._getEnrichedFlights();

    if (tanggal) {
      flights = flights.filter((f) => f.tanggal === tanggal);
    }

    return flights.filter((f) => {
      return daftarTujuan.some((tujuan) => f.tujuan.toLowerCase().includes(tujuan));
    });
  }

  /**
   * US-04: Pencarian penerbangan multi-destinasi
   * routes: array of leg preferences [{ asal, tujuan, tanggal }]
   */
  cariMultiDestinasi(legs) {
    if (!Array.isArray(legs) || legs.length === 0) {
      return [];
    }

    const allFlights = this._getEnrichedFlights();
    const resultLegs = [];

    legs.forEach((leg, index) => {
      let matched = allFlights;
      if (leg.asal) {
        matched = matched.filter((f) => f.asal.toLowerCase().includes(leg.asal.toLowerCase()));
      }
      if (leg.tujuan) {
        matched = matched.filter((f) => f.tujuan.toLowerCase().includes(leg.tujuan.toLowerCase()));
      }
      if (leg.tanggal) {
        matched = matched.filter((f) => f.tanggal === leg.tanggal);
      }

      resultLegs.push({
        legIndex: index + 1,
        kriteria: leg,
        pilihanPenerbangan: matched
      });
    });

    return resultLegs;
  }

  /**
   * US-06: Membandingkan penerbangan berdasarkan preferensi
   * (tujuan, tanggal, jam keberangkatan, serta komparasi harga)
   */
  bandingkanPenerbangan({ tujuan, tanggal, jamKeberangkatanMin, sortBy = "harga_asc" }) {
    let flights = this._getEnrichedFlights();

    if (tujuan) {
      flights = flights.filter((f) => f.tujuan.toLowerCase().includes(tujuan.toLowerCase()));
    }
    if (tanggal) {
      flights = flights.filter((f) => f.tanggal === tanggal);
    }
    if (jamKeberangkatanMin) {
      flights = flights.filter((f) => f.jamKeberangkatan >= jamKeberangkatanMin);
    }

    if (sortBy === "harga_asc") {
      flights.sort((a, b) => a.harga - b.harga);
    } else if (sortBy === "harga_desc") {
      flights.sort((a, b) => b.harga - a.harga);
    } else if (sortBy === "jam_asc") {
      flights.sort((a, b) => a.jamKeberangkatan.localeCompare(b.jamKeberangkatan));
    }

    const stats = {
      termurah: flights.length > 0 ? Math.min(...flights.map((f) => f.harga)) : 0,
      termahal: flights.length > 0 ? Math.max(...flights.map((f) => f.harga)) : 0,
      totalPilihan: flights.length
    };

    return {
      statistik: stats,
      daftarPenerbangan: flights
    };
  }

  getAllMaskapai() {
    return dataStore.data.maskapai;
  }
}

module.exports = new PenerbanganService();
