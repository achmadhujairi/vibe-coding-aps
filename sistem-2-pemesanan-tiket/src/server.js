const app = require("./app");

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Sistem 2: Pemesanan Tiket Pesawat (US-02 s/d US-09) Berjalan!`);
  console.log(`👤 Mahasiswa : Achmad Hujairi (255150200111042)`);
  console.log(`🌐 URL Server: http://localhost:${PORT}`);
  console.log(`💻 UI Tiket  : http://localhost:${PORT}/index.html`);
  console.log(`====================================================`);
});
