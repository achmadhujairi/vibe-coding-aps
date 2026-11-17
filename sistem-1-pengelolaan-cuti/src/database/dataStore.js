/**
 * DataStore in-memory untuk Sistem 1: Pengelolaan Cuti Pegawai (US-01)
 * Sesuai Domain Model Diagram: Pegawai, PengajuanCuti, RiwayatCuti, SisaCuti
 */

const createInitialState = () => ({
  pegawai: [
    { idPegawai: "PEG-001", namaPegawai: "Budi Santoso", jabatan: "Staff IT" },
    { idPegawai: "PEG-002", namaPegawai: "Siti Rahmawati", jabatan: "Analis Sistem" },
    { idPegawai: "PEG-003", namaPegawai: "Andi Wijaya", jabatan: "Frontend Developer" },
    { idPegawai: "PEG-004", namaPegawai: "Dewi Lestari", jabatan: "Quality Assurance" }
  ],

  pengajuanCuti: [
    {
      idPengajuan: "CUTI-2026-001",
      idPegawai: "PEG-001",
      tanggalMulai: "2026-11-20",
      tanggalSelesai: "2026-11-23",
      durasiCuti: 4,
      alasan: "Keperluan Keluarga",
      status: "Diajukan"
    },
    {
      idPengajuan: "CUTI-2026-002",
      idPegawai: "PEG-002",
      tanggalMulai: "2026-11-25",
      tanggalSelesai: "2026-11-27",
      durasiCuti: 3,
      alasan: "Liburan",
      status: "Diajukan"
    },
    {
      idPengajuan: "CUTI-2026-003",
      idPegawai: "PEG-003",
      tanggalMulai: "2026-12-01",
      tanggalSelesai: "2026-12-05",
      durasiCuti: 5,
      alasan: "Mudik Akhir Tahun",
      status: "Diajukan"
    }
  ],

  riwayatCuti: [
    { idRiwayat: "RWY-001", idPegawai: "PEG-001", periodeCuti: "10-12 Maret 2026", durasiCuti: 3 },
    { idRiwayat: "RWY-002", idPegawai: "PEG-001", periodeCuti: "02-04 Juli 2026", durasiCuti: 3 },
    { idRiwayat: "RWY-003", idPegawai: "PEG-002", periodeCuti: "15-18 Mei 2026", durasiCuti: 4 },
    { idRiwayat: "RWY-004", idPegawai: "PEG-003", periodeCuti: "01-02 Februari 2026", durasiCuti: 2 }
  ],

  sisaCuti: [
    { idPegawai: "PEG-001", tahun: 2026, jumlahSisaCuti: 6 },
    { idPegawai: "PEG-002", tahun: 2026, jumlahSisaCuti: 8 },
    { idPegawai: "PEG-003", tahun: 2026, jumlahSisaCuti: 10 },
    { idPegawai: "PEG-004", tahun: 2026, jumlahSisaCuti: 12 }
  ]
});

class DataStore {
  constructor() {
    this.data = createInitialState();
  }

  reset() {
    this.data = createInitialState();
  }
}

module.exports = new DataStore();
