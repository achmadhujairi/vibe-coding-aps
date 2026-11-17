const request = require("supertest");
const app = require("../src/app");
const dataStore = require("../src/database/dataStore");

describe("Sistem 2: Travel Manager Hub (US-07, US-08, US-09)", () => {
  beforeEach(() => {
    dataStore.reset();
  });

  // US-07: Status booking & filter
  test("GET /api/travel/status-booking - US-07 Task a & b: Filter status booking", async () => {
    const res = await request(app).get("/api/travel/status-booking?status=confirmed");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentFilter).toBe("confirmed");
    expect(res.body.data.bookings.every((b) => b.statusBooking === "confirmed")).toBe(true);
  });

  // US-08: Pemesanan tiket untuk pengunjung dan e-tiket via email
  test("POST /api/travel/pesan-pengunjung - US-08 Task a, b, d: Pesan tiket pengunjung & kirim e-tiket", async () => {
    const payload = {
      namaPengunjung: "Dewi Safitri",
      emailPengunjung: "dewi.safitri@gmail.com",
      idTiket: "TKT-005"
    };

    const res = await request(app).post("/api/travel/pesan-pengunjung").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pengunjung.nama).toBe("Dewi Safitri");
    expect(res.body.data.eTiket.statusPengiriman).toBe("TERKIRIM");
    expect(res.body.data.eTiket.alamatEmail).toBe("dewi.safitri@gmail.com");
  });

  test("GET /api/travel/tiket-pengunjung - US-08 Task c: Pengunjung melihat tiket di akunnya", async () => {
    const res = await request(app).get("/api/travel/tiket-pengunjung?email=clarissa@gmail.com");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pesanan.length).toBeGreaterThan(0);
  });

  // US-09: Otorisasi tiket via kode booking reference
  test("POST /api/travel/otorisasi-tiket - US-09 Task a: Otorisasi berhasil jika kode sesuai", async () => {
    const res = await request(app).post("/api/travel/otorisasi-tiket").send({
      kodeBookingReference: "BOOK-REF-7711"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("AUTHORIZED");
    expect(res.body.data.kodeBookingReference).toBe("BOOK-REF-7711");
  });

  test("POST /api/travel/otorisasi-tiket - US-09 Task b: Menampilkan pesan jika kode tidak sesuai", async () => {
    const res = await request(app).post("/api/travel/otorisasi-tiket").send({
      kodeBookingReference: "KODE-SALAH-1234"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    // Sesuai persis kata-kata Task b: "kode booking reference tidak sesuai"
    expect(res.body.message).toBe("kode booking reference tidak sesuai");
  });
});
