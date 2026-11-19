# Catatan Proyek & Eksplorasi Vibe Coding (Versi Laravel)

**Nama Proyek:** LOKA-KRAFT / WARUNG VOLT *(Katalog Digital & Dashboard Produk UMKM)*  
**Stack Teknis:** Laravel 11 + Livewire 3 + Alpine.js + Tailwind CSS + GSAP + AOS  
**Alur Workshop:** `Setup ➔ PRD UMKM ➔ Katalog ➔ Dashboard ➔ Uji ➔ Security ➔ Deploy ➔ Showcase`  

---

## 1. Tujuan Latihan
* Menguasai alur pengembangan aplikasi web *fullstack* secara terstruktur bersama AI *coding agent* (OpenCode) menggunakan arsitektur **Laravel 11 & Livewire 3**, mulai dari perumusan spesifikasi (`spec.md`), perancangan database (*migrations & seeders*), pembuatan antarmuka reaktif, hingga pengujian otomatis.
* Melatih kemampuan memberikan instruksi terarah (*prompting*) berbasis dokumen spesifikasi agar AI menghasilkan kode yang modular (memisahkan logika bisnis ke *Service Class* dan interaksi UI ke komponen *Livewire*) serta konsisten dengan gaya visual **Neon Brutalism**.
* Membangun kebiasaan melakukan audit keamanan dan pengujian otomatis (`php artisan test`) terhadap kode yang dihasilkan AI sebelum aplikasi dideploy.   

---

## 2. Target Aplikasi
Membangun aplikasi web **Katalog Digital & Dashboard Manajemen Produk UMKM** berbasis **Laravel 11 + Livewire 3** dengan dua modul utama yang terhubung ke database relasional:

1. **Storefront Katalog Publik (`CatalogStorefront`):**
   * Etalase produk UMKM lokal lengkap dengan pencarian *real-time*, filter kategori (`KOPI`, `KULINER`, `KRIYA`, `FESYEN`), dan filter ketersediaan stok.
   * Keranjang belanja berbasis *session* dengan kalkulasi diskon grosir otomatis (diskon 10% untuk pembelian $\ge 3$ item), tombol *checkout* WhatsApp terformat, serta simulasi pesanan instan yang otomatis mengurangi stok di database.
2. **Admin Dashboard UMKM (`AdminDashboard`, `ProductManager`, `OrderTracker`):**
   * Ringkasan analitik penjualan (*KPI Cards* total omzet, pesanan, produk aktif, peringatan stok menipis, serta grafik distribusi kategori).
   * Manajemen produk lengkap (CRUD + ekspor cadangan JSON) dan pelacak status pesanan (`PENDING` ➔ `DIPROSES` ➔ `SELESAI`) dengan antarmuka **Neon Brutalism** yang responsif.

---

## 3. Satu Risiko Utama Penggunaan AI yang Ingin Diperiksa

### Risiko: Celah Keamanan *Stored XSS* (Penggunaan `{!! !!}` Mentah) & *Race Condition* pada Pengurangan Stok
* **Deskripsi Risiko:** Saat diminta membuat tampilan *rich text* atau *checkout* cepat di Laravel, AI *coding agent* sering kali:
  1. Menggunakan sintaks Blade tidak ter-escape `{!! $variable !!}` untuk merender deskripsi produk atau catatan pembeli, yang membuka celah *Stored Cross-Site Scripting* (XSS).
  2. Mengurangi stok produk secara sederhana (`$product->decrement('stock', $qty)`) tanpa transaksi database dan penguncian baris (*pessimistic locking*), sehingga dua pembeli bersamaan bisa menyebabkan stok menjadi negatif (*race condition*).
* **Langkah Pemeriksaan & Mitigasi:**
  1. **Audit Template Blade & Sanitasi:** Memastikan seluruh output data input pengguna menggunakan kurung kurawal ganda `{{ $variable }}` dan membersihkan tag HTML lewat `SecuritySanitizer::cleanText()` sebelum disimpan ke database.
  2. **Transaksi Atomik Database:** Mewajibkan penggunaan `DB::transaction()` disertai `Product::where('id', $id)->lockForUpdate()->first()` di dalam `CartCheckoutService` saat memproses *checkout*.
  3. **Pengujian Otomatis (`Pest / PHPUnit`):** Menulis *feature test* di `tests/Feature/SecurityAndCheckoutTest.php` untuk menguji penyaringan *payload* `<script>alert('xss')</script>` serta memastikan sistem menolak transaksi jika stok tidak mencukupi.