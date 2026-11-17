const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Sistem 1: Pengelolaan Cuti Pegawai (US-01) Berjalan!`);
  console.log(`👤 Mahasiswa : Achmad Hujairi (255150200111042)`);
  console.log(`🌐 URL Server: http://localhost:${PORT}`);
  console.log(`💻 UI Cuti   : http://localhost:${PORT}/index.html`);
  console.log(`====================================================`);
});
