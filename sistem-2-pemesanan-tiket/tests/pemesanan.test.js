const request = require("supertest");
const app = require("../src/app");
const dataStore = require("../src/database/dataStore");

describe("Sistem 2: Pemesanan & Pembatalan Tiket (US-02 & US-06)", () => {
  beforeEach(() => {
    dataStore.reset();
  });

  test("GET /api/pemesanan - Mengambil seluruh data pesanan", async () => {
    const res = await request(app).get("/api/pemesanan");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/pemesanan/pesan - Task b: Memesan tiket pesawat yang diinginkan", async () => {
    const res = await request(app).post("/api/pemesanan/pesan").send({
      idPengguna: "USR-001",
      idTiket: "TKT-003",
      namaPenumpang: "Budi Santoso",
      emailPenumpang: "budi@example.com"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("kodeBookingReference");
    expect(res.body.data.statusBooking).toBe("booked");
  });

  test("POST /api/pemesanan/pesan - Gagal memesan tiket yang tidak ada", async () => {
    const res = await request(app).post("/api/pemesanan/pesan").send({
      idTiket: "TKT-999"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/pemesanan/:idPemesanan/batalkan - Task c: Membatalkan tiket pesawat", async () => {
    const res = await request(app)
      .post("/api/pemesanan/ORD-001/batalkan")
      .send({ alasan: "Perubahan Rencana" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pemesanan.statusBooking).toBe("cancelled");
  });

  test("POST /api/pemesanan/:idPemesanan/batalkan - Gagal batalkan pesanan yang sudah dibatalkan", async () => {
    await request(app).post("/api/pemesanan/ORD-001/batalkan").send({});
    const res = await request(app).post("/api/pemesanan/ORD-001/batalkan").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("ALREADY_CANCELLED");
  });
});
