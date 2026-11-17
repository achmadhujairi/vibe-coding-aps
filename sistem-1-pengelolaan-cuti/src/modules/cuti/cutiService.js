const dataStore = require("../../database/dataStore");

/**
 * Service untuk Sistem 1: Pengelolaan Cuti (US-01)
 */
class CutiService {
  getAllPegawai() {
    return dataStore.data.pegawai;
  }

  /**
   * Task a & b: Filter permohonan cuti berdasarkan tahun/bulan/tanggal
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
   * Task c: Tampilkan riwayat cuti pegawai dan sisa cuti tahun berjalan
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

  ajukanCuti({ idPegawai, tanggalMulai, tanggalSelesai, durasiCuti, alasan }) {
    const newPengajuan = {
      idPengajuan: `CUTI-${Date.now().toString().slice(-6)}`,
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
