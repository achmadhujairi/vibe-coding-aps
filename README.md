# Vibe Coding: Desain ke Implementasi (Tugas 9 APS)

> **Mata Kuliah:** Analisis & Perancangan Sistem (APS - TIF D)  
> **Nama Mahasiswa:** Achmad Hujairi  
> **NIM:** 255150200111042  
> **Teknologi:** Node.js, Express.js, Jest, Supertest, Tailwind CSS, SonarQube/SonarCloud  

---

## 📌 Ringkasan Proyek

Proyek ini merupakan implementasi nyata dari perancangan berorientasi objek (*Object-Oriented Design*) berbasis diagram UML yang telah dibuat pada tugas sebelumnya. Proyek ini dibangun menggunakan pendekatan **Vibe Coding** (pengembangan kode terarah berbantuan AI) untuk merealisasikan dua sistem utama:

1. **Sistem 1: Pengelolaan Cuti Pegawai (US-01)**  
   * **Aktor:** HRD Manajer  
   * **Fitur Utama:** Pemilihan periode cuti (tahun/bulan/tanggal), melihat daftar permohonan cuti pegawai dan durasinya, serta inspeksi mendalam riwayat cuti dan sisa cuti pegawai pada tahun berjalan.

2. **Sistem 2: Pemesanan Tiket Pesawat (US-02 s.d. US-09)**  
   * **US-02 (Pengguna):** Pencarian tiket tujuan tunggal, pemesanan tiket, dan pembatalan pesanan tiket.  
   * **US-03 (Pengguna):** Pencarian jadwal penerbangan untuk beberapa tujuan sekaligus (*multi-destination search*).  
   * **US-04 (Member Frequent Traveller):** Pencarian rute multi-destinasi berantai berdasarkan tanggal, lokasi asal, dan tujuan.  
   * **US-05 (Member Frequent Traveller):** Pembaruan profil personal dan validasi tiket (sistem memvalidasi jika profil lengkap, dan menolak dengan pesan *"data profil tidak lengkap"* jika belum lengkap).  
   * **US-06 (Member Frequent Traveller):** Pembandingan harga dan jadwal penerbangan sesuai preferensi jam keberangkatan dan tujuan.  
   * **US-07 (Manajer Travel):** Pemantauan dan pemfilteran status booking (*confirmed*, *booked*, *waiting for the payment*, *cancelled*).  
   * **US-08 (Manajer Travel & Pengunjung):** Pemesanan tiket untuk pengunjung, penyimpanan ke akun pengunjung, dan pengiriman otomatis e-tiket via email.  
   * **US-09 (Manajer Travel):** Otorisasi tiket pesawat menggunakan *Booking Reference Code* (sukses verifikasi jika sesuai, atau menampilkan pesan *"kode booking reference tidak sesuai"* jika kode salah).

---

## 🏗️ Pemetaan Desain Konseptual ke Struktur Kode

Kode disusun secara modular mengikuti pola **Boundary - Control - Entity (BCE)** sesuai *Robustness Diagram* dan *Sequence Diagram* pada tugas konseptual:

```
vibe-coding-aps/
├── .github/workflows/sonarcloud.yml   # Automasi CI/CD Quality Gate SonarCloud
├── sonar-project.properties           # Konfigurasi analisis SonarQube
├── package.json                       # Konfigurasi dependensi & skrip uji
├── src/
│   ├── app.js                         # Konfigurasi Express, middleware & routes
│   ├── server.js                      # Entry point HTTP server
│   ├── database/
│   │   └── dataStore.js               # Entity Store (Domain Model in-memory)
│   ├── modules/
│   │   ├── cuti/                      # Sistem 1 (US-01)
│   │   │   ├── cutiController.js      # Boundary-to-Control handler
│   │   │   ├── cutiService.js         # Business Logic Cuti
│   │   │   └── cutiRoutes.js          # REST Endpoints Cuti
│   │   ├── penerbangan/               # Sistem 2 (US-02, 03, 04, 06)
│   │   │   ├── penerbanganController.js
│   │   │   ├── penerbanganService.js
│   │   │   └── penerbanganRoutes.js
│   │   ├── profil/                    # Sistem 2 (US-05)
│   │   │   ├── profilController.js
│   │   │   ├── profilService.js
│   │   │   └── profilRoutes.js
│   │   ├── pemesanan/                 # Sistem 2 (US-02, 06)
│   │   │   ├── pemesananController.js
│   │   │   ├── pemesananService.js
│   │   │   └── pemesananRoutes.js
│   │   └── travel/                    # Sistem 2 (US-07, 08, 09)
│   │       ├── travelController.js
│   │       ├── travelService.js
│   │       └── travelRoutes.js
│   └── public/                        # Boundary (Interactive Web UI Dashboard)
│       ├── index.html
│       ├── css/style.css
│       └── js/app.js
└── tests/                             # Unit & Integration Tests (Jest & Supertest)
    ├── cuti.test.js
    ├── penerbangan.test.js
    ├── profil.test.js
    ├── pemesanan.test.js
    └── travel.test.js
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
* Node.js v18+ (Disarankan v20+)
* npm v9+

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server & UI
```bash
npm start
```
Buka peramban (browser) di alamat:
* **UI Dashboard Interaktif:** [http://localhost:3000](http://localhost:3000)
* **Health Check API:** [http://localhost:3000/health](http://localhost:3000/health)

---

## 🧪 Menjalankan Automated Tests & Code Coverage

Pengujian otomatis mencakup seluruh *User Story* (28 skenario pengujian dengan status lulus 100%):

```bash
npm test
```

Laporan *code coverage* format LCOV dan teks terminal akan dihasilkan di direktori `coverage/lcov.info` yang siap dikonsumsi oleh SonarQube/SonarCloud.

---

## 🛡️ Analisis Kualitas Kode (SonarQube & SonarCloud)

Proyek ini telah dikonfigurasi agar mematuhi standar *Clean Code* SonarQube (0 Bugs, 0 Vulnerabilities, 0 Security Hotspots, dan 0 Code Smells).

### Konfigurasi SonarCloud (GitHub Actions)
1. Push repository ini ke GitHub.
2. Daftarkan repository pada [SonarCloud.io](https://sonarcloud.io).
3. Tambahkan `SONAR_TOKEN` ke dalam **GitHub Repository Secrets** (`Settings` > `Secrets and variables` > `Actions`).
4. Pipeline GitHub Actions `.github/workflows/sonarcloud.yml` akan otomatis melakukan scan dan menguji kelulusan *Quality Gate*.

### Konfigurasi SonarQube Scanner Lokal
Jika menjalankan SonarQube server lokal:
```bash
sonar-scanner
```

---

## 📝 Catatan Refleksi Vibe Coding
* **Efisiensi Implementasi:** Penggunaan diagram konseptual (UML) sebagai panduan utama (*context prompt*) membuat AI mampu menghasilkan kode yang presisi sesuai batas *Boundary*, logika *Control*, dan skema *Entity*.
* **Verifikasi Manual:** Dilakukan pengujian otomatis (28 unit test) dan verifikasi fungsional langsung melalui UI Dashboard untuk memastikan tidak ada halusinasi logika pada skenario *edge case* (misal penolakan validasi tiket saat profil kosong).
