const request = require("supertest");
const app = require("../src/app");
const dataStore = require("../src/database/dataStore");

describe("Sistem 2: Pencarian & Perbandingan Penerbangan (US-02, US-03, US-04, US-06)", () => {
  beforeEach(() => {
    dataStore.reset();
  });

  test("GET /api/penerbangan/cari - US-02: Cari penerbangan sesuai tujuan", async () => {
    const res = await request(app).get("/api/penerbangan/cari?tujuan=Bali");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].tujuan).toContain("Bali");
    expect(res.body.data[0]).toHaveProperty("harga");
    expect(res.body.data[0]).toHaveProperty("namaMaskapai");
  });

  test("GET /api/penerbangan/beberapa-tujuan - US-03: Cari jadwal untuk beberapa tujuan", async () => {
    const res = await request(app).get("/api/penerbangan/beberapa-tujuan?tujuan=Bali,Surabaya");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  test("GET /api/penerbangan/beberapa-tujuan - Return 400 jika parameter tujuan kosong", async () => {
    const res = await request(app).get("/api/penerbangan/beberapa-tujuan");
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/penerbangan/multi-destinasi - US-04: Multi-destinasi berurutan", async () => {
    const legs = [
      { asal: "Jakarta", tujuan: "Bali", tanggal: "2026-11-20" },
      { asal: "Bali", tujuan: "Lombok", tanggal: "2026-11-22" }
    ];

    const res = await request(app).post("/api/penerbangan/multi-destinasi").send({ rute: legs });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].pilihanPenerbangan.length).toBeGreaterThan(0);
  });

  test("POST /api/penerbangan/multi-destinasi - Return 400 jika rute kosong", async () => {
    const res = await request(app).post("/api/penerbangan/multi-destinasi").send({ rute: [] });
    expect(res.statusCode).toBe(400);
  });

  test("GET /api/penerbangan/bandingkan - US-06: Bandingkan harga tiket", async () => {
    const res = await request(app).get(
      "/api/penerbangan/bandingkan?tujuan=Bali&sortBy=harga_asc"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.statistik.termurah).toBeLessThanOrEqual(
      res.body.data.statistik.termahal
    );
    const flights = res.body.data.daftarPenerbangan;
    expect(flights[0].harga).toBeLessThanOrEqual(flights[flights.length - 1].harga);
  });

  test("GET /api/penerbangan/maskapai - Mendapatkan daftar maskapai", async () => {
    const res = await request(app).get("/api/penerbangan/maskapai");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
