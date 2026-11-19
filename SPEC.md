# SPEC.md — Spesifikasi Sistem LOKA-KRAFT (WARUNG VOLT)

**Peran Penyusun:** System Analyst & Software Engineer  
**Target Aplikasi:** LOKA-KRAFT — Katalog Produk & Dashboard Manajemen UMKM Lokal (Kuliner, Kopi, Kriya, Fesyen)  
**Target Pengerjaan:** Latihan / Workshop Hands-On 1 Hari (`Setup ➔ PRD ➔ Katalog ➔ Dashboard ➔ Uji ➔ Security ➔ Deploy ➔ Showcase`)  
**Tech Stack:** Vite + JavaScript Vanilla + Tailwind CSS + GSAP + AOS + Canvas Confetti (100% Client-Side, Tanpa Backend & Tanpa Login Palsu)  

---

## 1. Tujuan (Objectives)
1. Membangun aplikasi web **Katalog Produk & Dashboard UMKM** interaktif dalam waktu 1 hari tanpa ketergantungan pada server *backend* maupun database eksternal.
2. Menyediakan etalase digital bergaya **Neon Brutalism** yang ekspresif, kaya animasi mikro (GSAP, AOS, Canvas Confetti), dan langsung bisa dicoba dalam satu perangkat.
3. Memungkinkan pengelola toko mengelola stok, harga, dan pesanan secara mandiri dengan penyimpanan persisten `localStorage` serta cadangan (*backup*) JSON.
4. Menerapkan standar keamanan *client-side* yang ketat (sanitasi XSS, validasi URL gambar, dan pembatasan nilai input) tanpa menyimpan kunci rahasia atau API key.

---

## 2. Pengguna (Target Users)
Aplikasi dirancang untuk dua peran yang beroperasi pada satu perangkat melalui navigasi switcher instan (tanpa alur login palsu yang menghambat *showcase*):
1. **Calon Pembeli (Pengunjung Etalase):** Menjelajahi katalog produk UMKM, mencari dan menyaring produk, memeriksa ketersediaan stok, menghitung total belanja beserta diskon grosir otomatis, serta memesan langsung via WhatsApp atau simulasi pesanan.
2. **Pengelola Toko (Admin UMKM):** Memantau ringkasan performa toko (KPI total omzet, produk aktif, stok menipis), menambah/mengubah/menghapus produk (CRUD), memproses status pesanan masuk, dan mengekspor cadangan data.

---

## 3. Daftar Fitur MVP (Minimum Viable Product)

### A. Modul Etalase Publik (`Storefront Katalog`)
1. **8 Produk Contoh UMKM Autentik:** Data awal (*seed data*) berisi 8 produk UMKM lokal nonpribadi lintas kategori (`KOPI`, `KULINER`, `KRIYA`, `FESYEN`) lengkap dengan gambar/placeholder lokal SVG.
2. **Pencarian, Filter, & Pengurutan (Sorting) Real-Time:**
   * Pencarian kata kunci berdasarkan nama produk, asal daerah, atau pengrajin.
   * Filter kategori (`SEMUA`, `KOPI`, `KULINER`, `KRIYA`, `FESYEN`), filter `READY STOCK ONLY`, dan toggle `PRODUK UNGGULAN`.
   * Pengurutan (*sorting*) berdasarkan Harga Termurah, Harga Termahal, dan Produk Unggulan.
3. **Kartu Produk Neon Brutalism & Modal Detail:** Menampilkan foto/placeholder, kode SKU, lencana asal pengrajin, harga dalam format Rupiah (`Rp`), indikator stok (`STOK: 12` / `SISA 2!` / `HABIS`), serta tombol `+ KERANJANG`.
4. **Keranjang Belanja, Diskon Grosir, & Checkout WhatsApp:**
   * Menghitung subtotal secara otomatis dan menerapkan **Diskon Bundling 10%** jika total kuantitas $\ge 3$ item.
   * Tombol **"Pesan via WhatsApp"** yang membuka tautan `https://wa.me/` dengan format rincian pesanan dan catatan pembeli siap kirim.
   * Tombol **"Simulasi Pesanan Langsung"** yang mencatat pesanan ke Dashboard Admin, memotong stok produk secara otomatis, dan memicu efek perayaan *neon confetti*.

### B. Modul Pengelola Toko (`Dashboard Demo CRUD`)
1. **Ringkasan KPI & Analitik Visual:** Menampilkan 4 kartu metrik utama (Total Omzet Simulasi, Total Produk, Total Stok Tersedia, Peringatan Stok Menipis $\le 3$) serta grafik batang distribusi stok/kategori.
2. **Manajemen Produk CRUD Lengkap:**
   * Tambah produk baru, edit produk yang ada, hapus produk, dan ubah status unggulan/aktif.
   * Dilengkapi tombol **"Reset Data Awal"** untuk mengembalikan 8 produk contoh dan tombol **"Export JSON"** untuk mengunduh cadangan data.
3. **Pelacak Pesanan Simulasi:** Daftar pesanan masuk dari simulasi *checkout* katalog dengan tombol ubah status (`PENDING` $\rightarrow$ `DIPROSES` $\rightarrow$ `SELESAI`).
4. **Penyimpanan Persisten (`localStorage`):** Seluruh perubahan produk, stok, keranjang, dan riwayat pesanan tersimpan otomatis di `localStorage` peramban.

---

## 4. Data Model (Skema Entitas JSON)

### A. Entitas `Product` (`localStorage: lokakraft_products_v1`)
```json
{
  "id": "prod-001",
  "nama": "Kopi Arabika Kintamani Roast 250g",
  "kategori": "KOPI",
  "harga": 85000,
  "stok": 14,
  "deskripsi": "Biji kopi arabika pilihan dari lereng Kintamani dengan profil sangrai medium dan aroma citrus segar.",
  "imageUrl": "/assets/kopi-kintamani.svg",
  "unggulan": true
}
```

**Aturan Validasi Field `Product`:**
* `id`: `string` unik (wajib, auto-generated saat tambah baru).
* `nama`: `string` (wajib, 3–80 karakter, disanitasi dari tag HTML).
* `kategori`: `string` enum (`KOPI` | `KULINER` | `KRIYA` | `FESYEN`).
* `harga`: `number` (wajib, angka $\ge 0$, tidak boleh `NaN` atau negatif).
* `stok`: `integer` (wajib, bilangan bulat $\ge 0$).
* `deskripsi`: `string` (opsional, maksimal 300 karakter, disanitasi dari tag HTML).
* `imageUrl`: `string` (opsional; hanya menerima path lokal `/...`, `https://`, atau `data:image/`; otomatis jatuh ke *placeholder* SVG lokal jika kosong atau gagal dimuat).
* `unggulan`: `boolean` (`true` / `false`).

### B. Entitas `Order` (`localStorage: lokakraft_orders_v1`)
```json
{
  "id": "ORD-1731987600",
  "namaPembeli": "Pelanggan Walk-In",
  "catatan": "Tolong bungkus rapi untuk oleh-oleh",
  "items": [
    { "productId": "prod-001", "nama": "Kopi Arabika Kintamani Roast 250g", "qty": 3, "harga": 85000 }
  ],
  "subtotal": 255000,
  "diskon": 25500,
  "total": 229500,
  "status": "PENDING",
  "waktu": "2026-11-19T11:30:00.000Z"
}
```

---

## 5. Non-Functional Requirements (NFR)
1. **Desain Visual & Animasi (Neon Brutalism):**
   * Kontras tinggi dengan latar `#0B0B0F` (Obsidian Black), kartu `#F4F4F0` (Off-White Paper), dan aksen `#CCFF00` (Volt Lime), `#FF2A85` (Hyper Magenta), `#00F0FF` (Electric Cyan).
   * Border tebal `3px solid #000000` dengan *hard offset shadow* `6px 6px 0px` serta efek tekan tombol saat di-hover/klik.
   * Animasi halus menggunakan **AOS** (saat scroll), **GSAP** (stagger masuk elemen & animasi angka), dan **Canvas Confetti** (saat transaksi selesai).
2. **Keamanan & Sanitasi Input (*Client-Side Hardening*):**
   * Semua input teks dari pengguna/pengelola wajib melewati fungsi `sanitizeHTML()` sebelum dirender ke DOM (menggunakan `textContent` atau *entity escaping*, dilarang memakai `innerHTML` mentah untuk data input).
   * Validasi skema URL gambar menolak protokol berbahaya seperti `javascript:` atau `data:text/html`.
3. **Batasan Sistem & Privasi:**
   * **Tanpa Backend & Tanpa Login Palsu:** Tidak ada *hardcoded password*, layar kunci palsu, ataupun panggilan API ke server luar.
   * **Tanpa API Key:** Tidak menyimpan token, kredensial, atau rahasia apa pun di dalam kode sumber maupun `localStorage`.
   * **Data Nonpribadi:** Seluruh nama toko, nomor WhatsApp contoh (`6281200000000`), dan produk menggunakan data fiktif/contoh yang aman untuk publik.
4. **Performa & Responsivitas:**
   * Waktu muat awal (*First Contentful Paint*) di bawah 1 detik pada peramban modern (Chrome, Edge, Firefox) dan responsif pada layar ponsel (`360px`) hingga desktop (`1440px`).

---

## 6. Risiko & Mitigasi (Risks & Mitigations)
1. **Risiko Stored XSS via Form CRUD Produk / Catatan Keranjang:**
   * *Dampak:* Pengelola atau penguji memasukkan kode `<script>alert(1)</script>` ke nama produk atau deskripsi, lalu dieksekusi oleh peramban.
   * *Mitigasi:* Menerapkan fungsi sanitasi ketat (`escapeHTML`) pada seluruh lapisan rendering dan memblokir penyisipan HTML mentah.
2. **Risiko Korupsinya Data `localStorage`:**
   * *Dampak:* Data JSON di `localStorage` terhapus atau rusak formatnya sehingga aplikasi gagal merender katalog.
   * *Mitigasi:* Membungkus pembacaan `JSON.parse()` dalam blok `try-catch` yang otomatis memulihkan 8 produk contoh (*fallback seed*) serta menyediakan tombol **"Reset Data Awal"**.
3. **Risiko Input Angka Tidak Valid (Harga/Stok Negatif atau Desimal Kacau):**
   * *Dampak:* Perhitungan subtotal keranjang menghasilkan `NaN` atau nilai negatif.
   * *Mitigasi:* Melakukan normalisasi `Math.max(0, Math.floor(Number(val) || 0))` pada saat validasi form dan kalkulasi keranjang.

---

## 7. Out-of-Scope (Di Luar Cakupan Latihan 1 Hari)
* Integrasi *payment gateway* nyata (Midtrans, Xendit, QRIS dinamis).
* Sistem autentikasi multi-user, registrasi akun, atau basis data *cloud* (Firebase/Supabase/MySQL).
* Unggah file gambar biner ke server penyimpanan objek (S3/Cloudinary); gambar cukup menggunakan URL aman atau aset SVG lokal.
* Integrasi API WhatsApp Business berbayar (cukup menggunakan tautan standar `https://wa.me/`).

---

## 8. Acceptance Criteria (Kriteria Penerimaan — Pemeriksaan Manual)
Penguji dapat memverifikasi kelulusan aplikasi secara manual melalui daftar periksa berikut:

- [ ] **AC-01 (Katalog Awal):** Saat aplikasi pertama kali dibuka, tampil tepat **8 produk contoh** lengkap dengan gambar/placeholder lokal, nama, kategori, harga berformat Rupiah (`Rp`), stok, dan lencana `UNGGULAN`.
- [ ] **AC-02 (Pencarian, Filter & Sorting):** Mengetik kata kunci di kolom pencarian menyaring kartu produk secara langsung; memilih filter kategori, filter stok tersedia, dan urutan harga (Termurah/Termahal) menampilkan urutan kartu yang sesuai.
- [ ] **AC-03 (Keranjang & Diskon Grosir):** Menambahkan $\ge 3$ item ke keranjang otomatis menampilkan potongan diskon 10% pada rincian harga.
- [ ] **AC-04 (Tombol Pesan WhatsApp):** Mengklik tombol **"Pesan via WhatsApp"** membuka tab baru menuju `https://wa.me/...` dengan teks pesan berisi daftar produk, kuantitas, dan total harga Rupiah yang sesuai isi keranjang.
- [ ] **AC-05 (Dashboard CRUD & Persistensi):** Berpindah ke tampilan Dashboard memungkinkan pengelola menambah produk baru, mengubah harga/stok produk, dan menghapus produk. Setelah halaman di-refresh (`F5`), seluruh perubahan tetap tersimpan.
- [ ] **AC-06 (Ringkasan KPI & Pemotongan Stok):** Angka Total Produk dan Total Stok pada kartu ringkasan Dashboard selalu sinkron dengan daftar produk; melakukan simulasi pesanan mengurangi stok produk terkait dan mencegah pembelian melebihi sisa stok.
- [ ] **AC-07 (Keamanan Input & Validasi):** Memasukkan teks `<script>alert('xss')</script>` pada nama/deskripsi produk tidak memunculkan pop-up peringatan (dirender sebagai teks biasa), dan form menolak harga $< 0$, stok $< 0$, atau URL `javascript:alert(1)`.
- [ ] **AC-08 (Tanpa Login Palsu & Tanpa API Key):** Tidak terdapat layar login palsu maupun variabel rahasia/API key di dalam kode sumber maupun `localStorage`.

---

## 9. Implementation Plan per Iterasi (Rencana Eksekusi 1 Hari)

### Iterasi 1: Setup Proyek & Fondasi Data (Jam 09.00 – 10.30)
* Inisialisasi proyek dengan `npm create vite@latest` (template Vanilla JS) dan konfigurasi Tailwind CSS serta font (`Space Grotesk` & `JetBrains Mono`).
* Membuat modul `src/data/seedProducts.js` berisi 8 produk contoh UMKM beserta aset *placeholder* SVG lokal.
* Membuat modul `src/utils/storage.js` dan `src/utils/security.js` (`escapeHTML`, `validateProduct`, `formatRupiah`).

### Iterasi 2: Etalase Katalog, Pencarian, Filter & Sorting (Jam 10.30 – 12.30)
* Membangun tata letak utama bergaya **Neon Brutalism** (marquee banner, grid kartu produk kontras tinggi, tombol taktil).
* Mengimplementasikan logika pencarian *real-time*, filter kategori/unggulan/stok, dan *sorting* harga.
* Menghubungkan animasi masuk **GSAP** dan animasi gulir **AOS**.

### Iterasi 3: Keranjang Belanja & Integrasi Pesan WhatsApp (Jam 13.30 – 15.00)
* Membangun panel *drawer* keranjang belanja beserta kontrol tambah/kurang kuantitas dan kalkulator diskon grosir 10% ($\ge 3$ item).
* Mengimplementasikan generator pesan terformat ke URL `https://wa.me/` serta tombol simulasi pesanan yang memotong stok dan memicu **Canvas Confetti**.

### Iterasi 4: Dashboard Demo CRUD & Ringkasan KPI (Jam 15.00 – 16.30)
* Membangun tampilan Dashboard Pengelola Toko dengan switcher instan dari navigasi atas (tanpa login palsu).
* Membuat kartu ringkasan KPI (Total Produk, Total Stok, Total Omzet Simulasi, Stok Menipis) yang diperbarui otomatis.
* Membangun form Tambah/Edit Produk, tombol Hapus, *Reset Data Awal*, dan *Export JSON*.

### Iterasi 5: Uji Manual, Audit Keamanan & Finalisasi Build (Jam 16.30 – 17.30)
* Menjalankan pemeriksaan manual seluruh poin **Acceptance Criteria (AC-01 s.d. AC-08)**, termasuk pengujian payload XSS dan batas nilai negatif.
* Memeriksa kebersihan kode (memastikan nol API key dan nol error di konsol browser) lalu menjalankan `npm run build` untuk verifikasi siap *deploy*.