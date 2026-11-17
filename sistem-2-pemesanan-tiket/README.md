# Sistem 2: Pemesanan Tiket Pesawat (US-02 s/d US-09)

> **Mata Kuliah:** Analisis & Perancangan Sistem (APS - TIF D)  
> **Nama Mahasiswa:** Achmad Hujairi  
> **NIM:** 255150200111042  

## Fitur Lengkap Sesuai User Story
* **US-02 (Pengguna):** Pencarian tiket tujuan tunggal, pemesanan tiket, dan pembatalan tiket.
* **US-03 (Pengguna):** Pencarian penerbangan untuk beberapa tujuan penerbangan sekaligus.
* **US-04 (Member Frequent Traveller):** Pencarian multi-destinasi berantai berdasarkan tanggal, asal, dan tujuan.
* **US-05 (Member Frequent Traveller):** Update profil & validasi tiket (valid jika lengkap, pesan *"data profil tidak lengkap"* jika belum lengkap).
* **US-06 (Member Frequent Traveller):** Perbandingan penerbangan & harga sesuai preferensi jam dan tujuan.
* **US-07 (Manajer Travel):** Pemantauan & filter status booking (*confirmed*, *booked*, *waiting for the payment*, *cancelled*).
* **US-08 (Manajer Travel & Pengunjung):** Pemesanan tiket untuk pengunjung, tampil di akun, dan pengiriman otomatis e-tiket ke email.
* **US-09 (Manajer Travel):** Otorisasi tiket via booking reference code (pesan *"kode booking reference tidak sesuai"* jika kode salah).

## Menjalankan Sistem
```bash
npm install
npm test      # Menjalankan 23 unit tests
npm start     # Menjalankan server pada port 3002
```
Buka antarmuka UI di browser: **http://localhost:3002**
