const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Aplikasi Vibe Coding APS Berhasil Dijalankan!`);
  console.log(`👤 Mahasiswa : Achmad Hujairi (255150200111042)`);
  console.log(`📚 Mata Kuliah: APS - TIF D`);
  console.log(`🌐 Server URL : http://localhost:${PORT}`);
  console.log(`💻 UI Dashboard: http://localhost:${PORT}/index.html`);
  console.log(`====================================================`);
});
