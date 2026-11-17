const request = require("supertest");
const app = require("../src/app");
const dataStore = require("../src/database/dataStore");

describe("Sistem 1: Pengelolaan Cuti Pegawai (US-01)", () => {
  beforeEach(() => {
    dataStore.reset();
  });

  test("GET /api/cuti/pegawai - Mengambil daftar pegawai", async () => {
    const res = await request(app).get("/api/cuti/pegawai");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("GET /api/cuti/pengajuan - Task a & b: Filter pengajuan cuti berdasarkan tahun dan bulan", async () => {
    const res = await request(app).get("/api/cuti/pengajuan?tahun=2026&bulan=11");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const first = res.body.data[0];
    expect(first).toHaveProperty("idPengajuan");
    expect(first).toHaveProperty("namaPegawai");
    expect(first).toHaveProperty("periodeCuti");
    expect(first).toHaveProperty("durasiCuti");
  });

  test("GET /api/cuti/pegawai/:idPegawai/detail - Task c: Menampilkan riwayat cuti dan sisa cuti tahun berjalan", async () => {
    const res = await request(app).get("/api/cuti/pegawai/PEG-001/detail?tahun=2026");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("riwayatCuti");
    expect(res.body.data).toHaveProperty("sisaCuti");
    expect(res.body.data.pegawai.namaPegawai).toBe("Budi Santoso");
  });

  test("GET /api/cuti/pegawai/:idPegawai/detail - Return 404 jika pegawai tidak ditemukan", async () => {
    const res = await request(app).get("/api/cuti/pegawai/PEG-999/detail");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/cuti/pengajuan - Menambahkan permohonan cuti baru", async () => {
    const payload = {
      idPegawai: "PEG-004",
      tanggalMulai: "2026-12-10",
      tanggalSelesai: "2026-12-12",
      durasiCuti: 3,
      alasan: "Acara Keluarga"
    };

    const res = await request(app).post("/api/cuti/pengajuan").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.durasiCuti).toBe(3);
  });

  test("POST /api/cuti/pengajuan - Validasi field wajib", async () => {
    const res = await request(app).post("/api/cuti/pengajuan").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
