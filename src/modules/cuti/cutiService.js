const dataStore = require("../../database/dataStore");

/**
 * Service untuk Sistem Pengelolaan Cuti (US-01)
 */
class CutiService {
  getAllPegawai() {
    return dataStore.data.pegawai;
  }

  /**
   * Menampilkan data pengajuan cuti berdasarkan filter periode (bulan/tahun/tanggal)
   * Task a & b: HRD manajer memilih periode, sistem menampilkan nama pegawai,
   * periode cuti yang diajukan, dan durasi cuti.
   */
  getPengajuanByPeriode({ tahun, bulan, tanggalMulai, tanggalSelesai }) {
    const pengajuanList = dataStore.data.pengajuanCuti;
    const pegawaiMap = new Map(dataStore.data.pegawai.map((p) => [p.idPegawai, p]));

    let filtered = pengajuanList;

    if (tahun) {
      filtered = filtered.filter((item) => item.tanggalMulai.startsWith(String(tahun)));
    }

    if (bulan) {
      const formattedMonth = String(bulan).padStart(2, "0");
      filtered = filtered.filter((item) => {
        const parts = item.tanggalMulai.split("-");
        return parts[1] === formattedMonth;
      });
    }

    if (tanggalMulai && tanggalSelesai) {
      filtered = filtered.filter((item) => {
        return item.tanggalMulai >= tanggalMulai && item.tanggalSelesai <= tanggalSelesai;
      });
    }

    return filtered.map((item) => {
      const pegawai = pegawaiMap.get(item.idPegawai) || { namaPegawai: "Tidak Diketahui" };
      return {
        idPengajuan: item.idPengajuan,
        idPegawai: item.idPegawai,
        namaPegawai: pegawai.namaPegawai,
        tanggalMulai: item.tanggalMulai,
        tanggalSelesai: item.tanggalSelesai,
        periodeCuti: `${item.tanggalMulai} s/d ${item.tanggalSelesai}`,
        durasiCuti: item.durasiCuti,
        alasan: item.alasan,
        status: item.status
      };
    });
  }

  /**
   * Task c: HRD manajer memilih nama pegawai, sistem menampilkan
   * riwayat cuti pegawai dan sisa waktu cuti yang dimiliki pegawai pada tahun berjalan.
   */
  getDetailCutiPegawai(idPegawai, tahun = 2026) {
    const pegawai = dataStore.data.pegawai.find((p) => p.idPegawai === idPegawai);
    if (!pegawai) {
      return null;
    }

    const riwayat = dataStore.data.riwayatCuti.filter((r) => r.idPegawai === idPegawai);
    const sisa = dataStore.data.sisaCuti.find(
      (s) => s.idPegawai === idPegawai && s.tahun === Number(tahun)
    );

    return {
      pegawai,
      riwayatCuti: riwayat,
      sisaCuti: sisa ? sisa.jumlahSisaCuti : 0,
      tahunBerjalan: Number(tahun)
    };
  }

  /**
   * Ajukan cuti baru (opsional/ekstensi untuk simulasi)
   */
  ajukanCuti({ idPegawai, tanggalMulai, tanggalSelesai, durasiCuti, alasan }) {
    const newPengajuan = {
      idPengajuan: `CUTI-${Date.now()}`,
      idPegawai,
      tanggalMulai,
      tanggalSelesai,
      durasiCuti: Number(durasiCuti),
      alasan,
      status: "Diajukan"
    };
    dataStore.data.pengajuanCuti.push(newPengajuan);
    return newPengajuan;
  }
}

module.exports = new CutiService();
