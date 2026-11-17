const request = require("supertest");
const app = require("../src/app");
const dataStore = require("../src/database/dataStore");

describe("Sistem 2: Data Profil & Validasi Tiket Member (US-05)", () => {
  beforeEach(() => {
    dataStore.reset();
  });

  test("GET /api/profil/members - Mengambil semua member", async () => {
    const res = await request(app).get("/api/profil/members");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  test("PUT /api/profil/members/:idMember - Task a: Update data profil personal", async () => {
    const updateData = {
      noPaspor: "B99887766",
      telepon: "081999888777",
      alamat: "Jl. Soekarno Hatta No. 10 Malang"
    };

    const res = await request(app).put("/api/profil/members/MEM-002").send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.dataProfil.noPaspor).toBe("B99887766");
    expect(res.body.data.statusProfil).toBe("LENGKAP");
  });

  test("POST /api/profil/validasi-tiket - Task b: Validasi berhasil jika profil lengkap", async () => {
    const res = await request(app).post("/api/profil/validasi-tiket").send({
      idMember: "MEM-001",
      idTiket: "TKT-001"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.valid).toBe(true);
    expect(res.body.status).toBe("VALIDASI_BERHASIL");
  });

  test("POST /api/profil/validasi-tiket - Task c: Menolak jika profil belum lengkap dengan pesan spesifik", async () => {
    const res = await request(app).post("/api/profil/validasi-tiket").send({
      idMember: "MEM-002",
      idTiket: "TKT-001"
    });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.valid).toBe(false);
    // Persis sesuai Task c: "data profil tidak lengkap"
    expect(res.body.message).toBe("data profil tidak lengkap");
  });

  test("POST /api/profil/validasi-tiket - Validasi input idMember dan idTiket", async () => {
    const res = await request(app).post("/api/profil/validasi-tiket").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
