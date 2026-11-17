/**
 * DataStore in-memory untuk Sistem Pengelolaan Cuti (US-01)
 * dan Sistem Pemesanan Tiket Pesawat (US-02 s/d US-09)
 * Sesuai Domain Model Diagram Tugas APS
 */

const createInitialState = () => ({
  // === SISTEM 1: PENGELOLAAN CUTI PEGAWAI (US-01) ===
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
  ],

  // === SISTEM 2: PEMESANAN TIKET PESAWAT (US-02 s/d US-09) ===
  maskapai: [
    { idMaskapai: "MSK-GA", namaMaskapai: "Garuda Indonesia" },
    { idMaskapai: "MSK-SA", namaMaskapai: "Super Air Jet" },
    { idMaskapai: "MSK-LA", namaMaskapai: "Lion Air" },
    { idMaskapai: "MSK-BA", namaMaskapai: "Batik Air" }
  ],

  penerbangan: [
    {
      idPenerbangan: "FL-001",
      idMaskapai: "MSK-GA",
      asal: "Jakarta (CGK)",
      tujuan: "Bali (DPS)",
      tanggal: "2026-11-20",
      jamKeberangkatan: "08:00"
    },
    {
      idPenerbangan: "FL-002",
      idMaskapai: "MSK-BA",
      asal: "Jakarta (CGK)",
      tujuan: "Bali (DPS)",
      tanggal: "2026-11-20",
      jamKeberangkatan: "11:30"
    },
    {
      idPenerbangan: "FL-003",
      idMaskapai: "MSK-SA",
      asal: "Jakarta (CGK)",
      tujuan: "Bali (DPS)",
      tanggal: "2026-11-20",
      jamKeberangkatan: "15:45"
    },
    {
      idPenerbangan: "FL-004",
      idMaskapai: "MSK-LA",
      asal: "Jakarta (CGK)",
      tujuan: "Surabaya (SUB)",
      tanggal: "2026-11-20",
      jamKeberangkatan: "09:15"
    },
    {
      idPenerbangan: "FL-005",
      idMaskapai: "MSK-GA",
      asal: "Bali (DPS)",
      tujuan: "Lombok (LOP)",
      tanggal: "2026-11-22",
      jamKeberangkatan: "14:00"
    },
    {
      idPenerbangan: "FL-006",
      idMaskapai: "MSK-BA",
      asal: "Lombok (LOP)",
      tujuan: "Yogyakarta (YIA)",
      tanggal: "2026-11-25",
      jamKeberangkatan: "16:30"
    },
    {
      idPenerbangan: "FL-007",
      idMaskapai: "MSK-GA",
      asal: "Jakarta (CGK)",
      tujuan: "Yogyakarta (YIA)",
      tanggal: "2026-11-21",
      jamKeberangkatan: "07:30"
    }
  ],

  tiket: [
    { idTiket: "TKT-001", idPenerbangan: "FL-001", harga: 1750000, statusTiket: "Tersedia" },
    { idTiket: "TKT-002", idPenerbangan: "FL-002", harga: 1350000, statusTiket: "Tersedia" },
    { idTiket: "TKT-003", idPenerbangan: "FL-003", harga: 950000, statusTiket: "Tersedia" },
    { idTiket: "TKT-004", idPenerbangan: "FL-004", harga: 820000, statusTiket: "Tersedia" },
    { idTiket: "TKT-005", idPenerbangan: "FL-005", harga: 600000, statusTiket: "Tersedia" },
    { idTiket: "TKT-006", idPenerbangan: "FL-006", harga: 1100000, statusTiket: "Tersedia" },
    { idTiket: "TKT-007", idPenerbangan: "FL-007", harga: 1200000, statusTiket: "Tersedia" }
  ],

  memberFrequentTraveller: [
    {
      idMember: "MEM-001",
      nama: "Achmad Hujairi",
      email: "hujairi@student.ub.ac.id",
      statusProfil: "LENGKAP",
      dataProfil: {
        namaLengkap: "Achmad Hujairi",
        email: "hujairi@student.ub.ac.id",
        noPaspor: "A12345678",
        telepon: "081234567890",
        alamat: "Jl. Veteran No. 1 Malang",
        nomorFrequentFlyer: "FF-889922"
      }
    },
    {
      idMember: "MEM-002",
      nama: "Rian Pratama",
      email: "rian@example.com",
      statusProfil: "TIDAK_LENGKAP",
      dataProfil: {
        namaLengkap: "Rian Pratama",
        email: "rian@example.com",
        noPaspor: "",
        telepon: "",
        alamat: "",
        nomorFrequentFlyer: "FF-112233"
      }
    }
  ],

  pengguna: [
    { idPengguna: "USR-001", nama: "User Umum", email: "user.umum@example.com" }
  ],

  pengunjung: [
    { idPengunjung: "GST-001", nama: "Clarissa Putri", email: "clarissa@gmail.com" }
  ],

  manajerTravel: [
    { idManajer: "MGR-001", nama: "Travel Manager Hub" }
  ],

  pemesanan: [
    {
      idPemesanan: "ORD-001",
      idPengguna: "USR-001",
      idTiket: "TKT-002",
      tanggalPemesanan: "2026-11-17",
      statusBooking: "confirmed",
      kodeBookingReference: "BOOK-REF-7711",
      penumpang: { nama: "User Umum", email: "user.umum@example.com" }
    },
    {
      idPemesanan: "ORD-002",
      idPengguna: "MEM-001",
      idTiket: "TKT-001",
      tanggalPemesanan: "2026-11-17",
      statusBooking: "booked",
      kodeBookingReference: "BOOK-REF-8822",
      penumpang: { nama: "Achmad Hujairi", email: "hujairi@student.ub.ac.id" }
    },
    {
      idPemesanan: "ORD-003",
      idPengguna: "GST-001",
      idTiket: "TKT-004",
      tanggalPemesanan: "2026-11-17",
      statusBooking: "waiting for the payment",
      kodeBookingReference: "BOOK-REF-9933",
      penumpang: { nama: "Clarissa Putri", email: "clarissa@gmail.com" }
    }
  ],

  pembatalan: [],
  validasiTiketLog: [],
  emailETiket: [
    {
      idEmail: "EML-001",
      idPemesanan: "ORD-001",
      alamatEmail: "user.umum@example.com",
      statusPengiriman: "TERKIRIM",
      waktuKirim: "2026-11-17 08:30"
    }
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

const instance = new DataStore();
module.exports = instance;
