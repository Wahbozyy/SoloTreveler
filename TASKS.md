# TASKS.md — Milestone & Rencana Kerja Pengembangan LOKA-KRAFT

**Target Aplikasi:** LOKA-KRAFT — Katalog Digital & Dashboard Manajemen UMKM Lokal  
**Gaya Desain:** Neon Brutalism (High-Contrast Tactile UI, **Tanpa Emoticon/Emoji**, 100% Ikon Vektor SVG)  
**Stack Teknis:** Vite + JavaScript Vanilla + Tailwind CSS + Lucide Icons + GSAP + AOS + Canvas Confetti + Vitest  

---

## Milestone 1: Scaffold Proyek & Fondasi Desain
* [ ] **M1.1 — Inisialisasi Proyek Vite & Dependensi Utama**
  * **Deskripsi:** Menyiapkan proyek Vite (Vanilla JS), mengonfigurasi Tailwind CSS, menginstal pustaka ikon vektor (`lucide`), animasi (`gsap`, `aos`, `canvas-confetti`), serta memuat font Google (`Space Grotesk`, `Plus Jakarta Sans`, `JetBrains Mono`).
  * **Acceptance Criteria:** Perintah `npm run dev` berjalan lancar tanpa error di konsol; gaya dasar Neon Brutalism (latar `#0B0B0F`, border `3px solid #000000`, *hard shadow* `#CCFF00`) dan ikon SVG muncul dengan benar tanpa satu pun karakter emoticon/emoji.
  * **Berkas yang Mungkin Berubah:** `package.json`, `index.html`, `src/style.css`, `src/main.js`, `tailwind.config.js`

* [ ] **M1.2 — Penyusunan Data Awal (8 Produk Contoh) & Aset Placeholder SVG**
  * **Deskripsi:** Membuat data *seed* berisi 8 produk UMKM nonpribadi lintas kategori (`KOPI`, `KULINER`, `KRIYA`, `FESYEN`) beserta aset gambar SVG lokal untuk masing-masing produk.
  * **Acceptance Criteria:** Tersedia tepat 8 objek produk valid sesuai skema (`id`, `nama`, `kategori`, `harga`, `stok`, `deskripsi`, `imageUrl`, `unggulan`) dengan aset gambar SVG lokal yang tampil tajam tanpa tautan rusak dan bebas emoticon.
  * **Berkas yang Mungkin Berubah:** `src/data/seedProducts.js`, `public/assets/prod-01.svg` s.d. `public/assets/prod-08.svg`

---

## Milestone 2: Etalase Katalog Produk (Storefront UI)
* [ ] **M2.1 — Sticky Navbar, Marquee Banner & Hero Section**
  * **Deskripsi:** Membangun bilah navigasi lengket dengan pengalih tampilan `[ ETALASE KATALOG ]` dan `[ DASHBOARD TOKO ]`, tombol keranjang belanja dengan ikon vektor, pita teks berjalan (*marquee*) dengan pemisah bentuk geometris SVG, serta bagian Hero bergaya Neon Brutalism.
  * **Acceptance Criteria:** Navigasi responsif pada lebar layar `360px` hingga `1440px`, memiliki target sentuh minimal `44px × 44px`, animasi masuk GSAP berjalan halus, dan tidak mengandung emoticon.
  * **Berkas yang Mungkin Berubah:** `index.html`, `src/components/Navbar.js`, `src/components/Hero.js`, `src/style.css`

* [ ] **M2.2 — Grid Kartu Produk & Modal Detail Produk**
  * **Deskripsi:** Merender grid kartu produk responsif (1 kolom mobile, 2 kolom tablet, 4 kolom desktop) lengkap dengan lencana kategori, lencana `UNGGULAN` (ikon bintang SVG), harga Rupiah (`Rp`), indikator stok, tombol `DETAIL`, dan tombol `+ KERANJANG`.
  * **Acceptance Criteria:** Ke-8 produk contoh tampil rapi dengan kontras warna WCAG AA/AAA, mengklik tombol `DETAIL` membuka modal informasi lengkap produk, dan animasi gulir AOS bekerja mulus.
  * **Berkas yang Mungkin Berubah:** `src/components/ProductGrid.js`, `src/components/ProductModal.js`, `src/utils/formatters.js`

---

## Milestone 3: Interaksi Pencarian, Filter & Sorting
* [ ] **M3.1 — Pencarian Real-Time & Multi-Filter Kategori/Status**
  * **Deskripsi:** Mengimplementasikan input pencarian instan berdasarkan nama/deskripsi produk, filter chip kategori (`SEMUA`, `KOPI`, `KULINER`, `KRIYA`, `FESYEN`), toggle `UNGGULAN`, dan toggle `READY STOCK ONLY`.
  * **Acceptance Criteria:** Mengetik kata kunci atau memilih kombinasi filter langsung memperbarui daftar kartu produk tanpa reload halaman; jika hasil kosong, tampil pesan keadaan kosong (*empty state*) dengan tombol reset filter.
  * **Berkas yang Mungkin Berubah:** `src/components/FilterBar.js`, `src/state/store.js`, `src/components/ProductGrid.js`

* [ ] **M3.2 — Pengurutan Produk (Sorting)**
  * **Deskripsi:** Menambahkan kontrol dropdown untuk mengurutkan produk berdasarkan `Unggulan (Default)`, `Harga: Termurah`, `Harga: Termahal`, dan `Stok Terbanyak`.
  * **Acceptance Criteria:** Urutan kartu produk berubah secara akurat sesuai opsi *sorting* yang dipilih dan tetap sinkron dengan filter/pencarian yang sedang aktif.
  * **Berkas yang Mungkin Berubah:** `src/components/FilterBar.js`, `src/state/store.js`

---

## Milestone 4: Keranjang Belanja & Integrasi Pesan WhatsApp
* [ ] **M4.1 — Slide-Over Cart Drawer & Kalkulator Diskon Grosir**
  * **Deskripsi:** Membangun panel keranjang geser dengan kontrol tambah/kurang kuantitas (`+` / `-`), tombol hapus item, validasi batas maksimal sesuai stok tersedia, dan perhitungan otomatis **Diskon Bundling 10%** untuk total kuantitas $\ge 3$ item.
  * **Acceptance Criteria:** Subtotal, potongan diskon 10%, dan total akhir dalam format Rupiah terhitung akurat secara *real-time*; pengguna tidak dapat menambahkan item melebihi jumlah stok produk.
  * **Berkas yang Mungkin Berubah:** `src/components/CartDrawer.js`, `src/utils/cartCalculator.js`, `src/state/store.js`

* [ ] **M4.2 — Generator Pesan WhatsApp & Simulasi Order Instan**
  * **Deskripsi:** Menghubungkan tombol **"PESAN VIA WHATSAPP"** (ikon SVG WhatsApp) ke URL `https://wa.me/6281200000000?text=...` berisi format rincian belanja bersih tanpa emoticon, serta tombol **"SIMULASI ORDER INSTAN"** yang memotong stok dan memicu efek Canvas Confetti.
  * **Acceptance Criteria:** Klik tombol WhatsApp membuka tab baru dengan teks pesanan ter-encode rapi (nama produk, qty, subtotal, diskon, total, dan catatan pembeli); klik simulasi order memotong stok produk dan memunculkan perayaan konfeti.
  * **Berkas yang Mungkin Berubah:** `src/components/CartDrawer.js`, `src/utils/whatsappBuilder.js`, `src/state/store.js`

---

## Milestone 5: Dashboard Demo CRUD & Ringkasan KPI
* [ ] **M5.1 — Kartu Ringkasan KPI & Daftar Pesanan Masuk**
  * **Deskripsi:** Membangun halaman Dashboard Pengelola Toko yang menampilkan 4 kartu metrik utama (Total Produk, Total Unit Stok, Total Omzet Simulasi, Peringatan Stok Menipis $\le 3$) serta riwayat pesanan dari simulasi katalog.
  * **Acceptance Criteria:** Angka pada seluruh kartu KPI dan daftar pesanan selalu sinkron secara otomatis setiap kali terjadi penambahan, penghapusan, atau simulasi transaksi produk.
  * **Berkas yang Mungkin Berubah:** `src/components/DashboardView.js`, `src/components/KpiSummary.js`

* [ ] **M5.2 — Form & Tabel Manajemen Produk (CRUD Lengkap)**
  * **Deskripsi:** Membuat formulir Tambah/Edit produk (`nama`, `kategori`, `harga`, `stok`, `deskripsi`, `imageUrl`, `unggulan`) serta tabel daftar inventaris produk dengan tombol `EDIT`, `HAPUS`, `RESET DATA AWAL`, dan `EXPORT JSON`.
  * **Acceptance Criteria:** Pengelola dapat menambah produk baru, mengubah data produk yang ada, menghapus produk dengan konfirmasi, mengunduh file cadangan `.json`, dan mengembalikan 8 data contoh awal dengan satu klik.
  * **Berkas yang Mungkin Berubah:** `src/components/ProductForm.js`, `src/components/InventoryTable.js`, `src/components/DashboardView.js`

---

## Milestone 6: Persistensi Penyimpanan `localStorage`
* [ ] **M6.1 — Sinkronisasi State Otomatis & Pemulihan Data Aman**
  * **Deskripsi:** Menyimpan seluruh perubahan daftar produk, keranjang belanja, dan riwayat pesanan ke `localStorage` dengan kunci versi (`lokakraft_products_v1`, `lokakraft_cart_v1`, `lokakraft_orders_v1`) disertai penanganan *error* `try-catch`.
  * **Acceptance Criteria:** Setelah melakukan perubahan produk atau menambah item ke keranjang lalu memuat ulang halaman (`F5`), seluruh data tetap bertahan; jika data di `localStorage` rusak/korup, aplikasi otomatis memulihkan data awal tanpa *crash*.
  * **Berkas yang Mungkin Berubah:** `src/utils/storage.js`, `src/state/store.js`

---

## Milestone 7: Testing (Pengujian Otomatis & Manual)
* [ ] **M7.1 — Pengujian Unit Otomatis dengan Vitest**
  * **Deskripsi:** Menulis dan menjalankan rangkaian *unit test* menggunakan Vitest untuk menguji fungsi kalkulator keranjang, diskon 10%, format Rupiah, validasi produk, dan penyimpanan `localStorage`.
  * **Acceptance Criteria:** Perintah `npx vitest run` mengeksekusi seluruh skenario pengujian dan lulus 100% tanpa kegagalan (*zero failed tests*).
  * **Berkas yang Mungkin Berubah:** `package.json`, `src/tests/cartAndStorage.test.js`

* [ ] **M7.2 — Verifikasi Checklist Acceptance Criteria Manual**
  * **Deskripsi:** Melakukan uji coba langsung seluruh alur pengguna (pembeli dan pengelola toko) pada viewport mobile (`360px`) dan desktop (`1280px`) serta audit nol emoticon.
  * **Acceptance Criteria:** Seluruh alur berjalan mulus tanpa error di browser console dan tidak ditemukan karakter emoticon/emoji di seluruh tampilan web maupun pesan WhatsApp.
  * **Berkas yang Mungkin Berubah:** `CATATAN.md` (dokumentasi hasil uji manual)

---

## Milestone 8: Security Hardening (Keamanan Client-Side)
* [ ] **M8.1 — Sanitasi Input Anti-XSS & Validasi Skema Data Ketat**
  * **Deskripsi:** Menerapkan utilitas `escapeHTML()` dan `sanitizeUrl()` pada seluruh lapisan input dan rendering DOM, serta memblokir nilai negatif (`harga < 0`, `stok < 0`) maupun skema URL berbahaya (`javascript:`).
  * **Acceptance Criteria:** Memasukkan payload `<script>alert('xss')</script>` atau `<img src=x onerror=alert(1)>` pada form produk/pencarian/catatan keranjang tampil sebagai teks biasa tanpa mengeksekusi skrip; URL `javascript:alert(1)` ditolak oleh validator.
  * **Berkas yang Mungkin Berubah:** `src/utils/security.js`, `src/components/ProductForm.js`, `src/components/ProductGrid.js`, `src/components/CartDrawer.js`, `src/tests/security.test.js`

* [ ] **M8.2 — Audit Keamanan Kode Sumber (Zero Secrets & CSP Meta)**
  * **Deskripsi:** Menambahkan tag meta *Content Security Policy* (CSP) dasar di `index.html` dan memastikan tidak ada API key, token rahasia, maupun layar login palsu di dalam repositori.
  * **Acceptance Criteria:** Hasil pemindaian kode sumber bersih dari kredensial/API key dan header/meta keamanan terpasang valid.
  * **Berkas yang Mungkin Berubah:** `index.html`

---

## Milestone 9: Build Produksi
* [ ] **M9.1 — Optimasi Aset & Verifikasi Production Build Vite**
  * **Deskripsi:** Menjalankan proses *bundling* produksi (`npm run build`) dan menguji hasilnya melalui `npm run preview` untuk memastikan seluruh aset SVG, CSS, dan skrip termuat sempurna.
  * **Acceptance Criteria:** Perintah `npm run build` selesai dengan kode keluar `0` tanpa *warning* yang merusak fungsi, folder `dist/` terbentuk rapi, dan tampilan di `npm run preview` identik dengan mode pengembangan.
  * **Berkas yang Mungkin Berubah:** `vite.config.js`, `package.json`, `dist/` (hasil build)

---

## Milestone 10: Deployment & Showcase
* [ ] **M10.1 — Publikasi ke Hosting Statis (Vercel / Netlify / GitHub Pages)**
  * **Deskripsi:** Menghubungkan repositori proyek ke layanan hosting statis gratis dan melakukan *deployment* aplikasi agar dapat diakses melalui tautan publik HTTPS.
  * **Acceptance Criteria:** URL publik aktif dapat diakses dari perangkat desktop maupun ponsel, seluruh fitur katalog, WhatsApp link, CRUD dashboard, dan `localStorage` berfungsi normal di lingkungan produksi.
  * **Berkas yang Mungkin Berubah:** `vercel.json` atau `netlify.toml` (jika diperlukan konfigurasi SPA/routing), `README.md` (mencantumkan tautan demo publik)