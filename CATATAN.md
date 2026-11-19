# Catatan Proyek & Eksplorasi Vibe Coding (Versi Vite + Vanilla JS)

**Nama Proyek:** LOKA-KRAFT / WARUNG VOLT *(Katalog Digital & Dashboard Produk UMKM)*  
**Stack Teknis:** Vite + Vanilla JavaScript (ES Modules) + Tailwind CSS + GSAP + AOS  
**Target Deployment:** Vercel (Static Site Hosting)  
**Alur Workshop:** `Setup ➔ PRD UMKM ➔ Katalog ➔ Dashboard ➔ Uji ➔ Security ➔ Deploy ➔ Showcase`  

---

## 1. Tujuan Latihan
- Menguasai alur pengembangan aplikasi web *frontend* interaktif secara bertahap bersama AI *coding agent* (OpenCode) menggunakan **Vite + Vanilla JavaScript**, mulai dari penyusunan spesifikasi (`SPEC.md`, `UI-SPEC.md`, `TASKS.md`), pengelolaan state dengan `localStorage`, hingga *deployment* instan ke **Vercel**.
- Melatih kemampuan memberikan instruksi terarah (*prompting*) berbasis dokumen spesifikasi agar AI menghasilkan kode JavaScript yang modular (memisahkan layer data, utilitas keamanan, dan rendering DOM) serta konsisten dengan gaya visual **Neon Brutalism** tanpa emoticon.
- Membangun kebiasaan melakukan audit keamanan *client-side* dan pengujian unit otomatis (`Vitest`) terhadap kode yang dihasilkan AI sebelum aplikasi dipublikasikan.

---

## 2. Target Aplikasi
Membangun aplikasi web **Katalog Digital & Dashboard Manajemen Produk UMKM** berbasis **Vite + Vanilla JavaScript** yang berjalan sepenuhnya di *browser* (siap *deploy* di Vercel tanpa konfigurasi server) dengan dua modul utama pada satu perangkat:

1. **Storefront Katalog Publik:**
   - Etalase produk UMKM lokal (minimal 8 produk contoh dengan aset gambar/placeholder lokal) lengkap dengan pencarian *real-time*, filter kategori (`KOPI`, `KULINER`, `KRIYA`, `FESYEN`), filter ketersediaan stok, dan pengurutan harga/unggulan.
   - Keranjang belanja dengan kalkulasi diskon grosir otomatis (diskon 10% untuk pembelian $\ge 3$ item), tombol pesan **WhatsApp** dengan format teks terstruktur otomatis, serta simulasi pesanan yang langsung memperbarui stok di `localStorage`.
2. **Dashboard Demo Pengelola Toko:**
   - Ringkasan analitik toko (*KPI Cards* total produk, total stok, estimasi nilai inventaris, peringatan stok menipis, serta grafik distribusi kategori).
   - Manajemen produk lengkap (CRUD: tambah, ubah, hapus produk, dan reset data awal) dengan antarmuka **Neon Brutalism** kontras tinggi tanpa emoticon.

---

## 3. Satu Risiko Utama Penggunaan AI yang Ingin Diperiksa

### Risiko: Celah Keamanan *DOM-Based XSS* (Penggunaan `innerHTML` Mentah) & Korupsi Data `localStorage`
- **Deskripsi Risiko:** Saat diminta merender daftar kartu produk atau hasil pencarian secara dinamis dengan Vanilla JavaScript, AI *coding agent* sering kali:
  1. Menyisipkan input pengguna (kata kunci pencarian, nama produk, atau deskripsi pada form dashboard) langsung ke dalam template literal `element.innerHTML = ...` tanpa *escaping*, sehingga membuka celah eksekusi skrip berbahaya (*DOM-Based Cross-Site Scripting*).
  2. Membaca dan menulis data `localStorage` (`JSON.parse`) tanpa blok `try-catch` atau validasi skema tipe data, sehingga jika data rusak atau dimodifikasi manual (misal harga/stok bernilai negatif atau `NaN`), seluruh aplikasi mengalami *blank screen* (*runtime crash*).
- **Langkah Pemeriksaan & Mitigasi:**
  1. **Audit Rendering DOM & Sanitasi:** Mewajibkan penggunaan utilitas `escapeHTML()` dan `sanitizeUrl()` pada seluruh data dinamis sebelum masuk ke DOM, serta mengutamakan `textContent` untuk teks biasa.
  2. **Validasi Skema & Proteksi Penyimpanan:** Membungkus operasi `localStorage` dengan validasi tipe data ketat (`harga >= 0`, `stok` bilangan bulat $\ge 0$) dan mekanisme *fallback* otomatis ke data awal (*seed data*) jika penyimpanan rusak.
  3. **Pengujian Otomatis (`Vitest`):** Menulis *unit test* untuk memastikan fungsi sanitasi berhasil menetralkan *payload* `<script>alert('xss')</script>` dan menolak input angka negatif sebelum kode di-*build* (`npm run build`) dan di-*deploy* ke **Vercel**.