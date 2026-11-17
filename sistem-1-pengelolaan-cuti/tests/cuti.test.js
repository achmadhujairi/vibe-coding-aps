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
  });

  test("GET /api/cuti/pengajuan - Task a & b: Filter pengajuan cuti", async () => {
    const res = await request(app).get("/api/cuti/pengajuan?tahun=2026&bulan=11");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("idPengajuan");
    expect(res.body.data[0]).toHaveProperty("durasiCuti");
  });

  test("GET /api/cuti/pegawai/:idPegawai/detail - Task c: Riwayat dan sisa cuti", async () => {
    const res = await request(app).get("/api/cuti/pegawai/PEG-001/detail?tahun=2026");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("sisaCuti");
    expect(res.body.data).toHaveProperty("riwayatCuti");
  });

  test("GET /api/cuti/pegawai/:idPegawai/detail - 404 jika pegawai tidak ada", async () => {
    const res = await request(app).get("/api/cuti/pegawai/PEG-999/detail");
    expect(res.statusCode).toBe(404);
  });

  test("POST /api/cuti/pengajuan - Tambah pengajuan cuti baru", async () => {
    const res = await request(app).post("/api/cuti/pengajuan").send({
      idPegawai: "PEG-001",
      tanggalMulai: "2026-12-20",
      tanggalSelesai: "2026-12-22",
      durasiCuti: 3,
      alasan: "Liburan Akhir Tahun"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
