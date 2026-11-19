UI-SPEC.md — Spesifikasi Desain Antarmuka LOKA-KRAFT (WARUNG VOLT)
Target Aplikasi: LOKA-KRAFT — Katalog Produk & Dashboard Manajemen UMKM Lokal
Gaya Desain: Neon Brutalism (High-Contrast Tactile Cyber-Brutalist)
Pendekatan Layout: Mobile-First Responsive (360px – 1440px+)
Standar Aksesibilitas: WCAG AA/AAA High-Contrast (>= 7:1 pada teks utama & tombol aksi)
1. Sistem Warna & Token Visual (Color Palette & Tokens)
Perpaduan kontras tajam antara kanvas gelap (Obsidian Black), permukaan kartu kertas hangat (Warm Off-White Paper), dan aksen neon menyala dengan garis tepi hitam pekat (3px solid #000000).
Token Nama
Kode Hex
Peran & Penggunaan Utama
Rasio Kontras
--bg-canvas
#0B0B0F
Latar belakang utama aplikasi (Obsidian Black)
—
--surface-paper
#F4F4F0
Permukaan kartu produk, modal, & form (Warm Off-White)
17.8:1 vs #000000
--surface-dark
#16161E
Panel sekunder, drawer keranjang, & tabel dashboard
14.2:1 vs #F4F4F0
--neon-lime
#CCFF00
Aksen primer, CTA utama, & hard shadow kartu aktif
16.4:1 vs #000000
--neon-cyan
#00F0FF
Lencana kategori, indikator stok aman, & sorotan filter
13.9:1 vs #000000
--neon-magenta
#FF2A85
Lencana UNGGULAN, diskon 10%, & peringatan stok menipis
5.6:1 vs #000000
--wa-volt
#25D366
Tombol aksi khusus Pesan via WhatsApp (dengan border hitam)
10.8:1 vs #000000
--border-ink
#000000
Garis tepi brutalist 3px solid & bayangan keras tanpa blur
—

Aturan Geometri & Efek Taktil (Tactile Brutalism)
Border: 3px solid #000000 (pada elemen terang) atau 3px solid #CCFF00 (pada kontainer gelap).
Hard Offset Shadow: box-shadow: 6px 6px 0px #CCFF00 (pada kanvas gelap) atau box-shadow: 5px 5px 0px #000000 (di dalam kartu terang).
Interaksi Tekan (Hover/Active): Saat tombol atau kartu diarahkan kursor/ditekan, elemen bergeser transform: translate(3px, 3px) dan bayangan menyusut menjadi 2px 2px 0px dengan transisi cepat 120ms ease-out.
2. Tipografi (Typography Scale)
Font Display & Heading: 'Space Grotesk', sans-serif (Weight: 700 Bold & 800 ExtraBold, tight tracking -0.03em, huruf kapital pada judul bagian & lencana).
Font Body & UI: 'Plus Jakarta Sans', sans-serif (Weight: 500 Medium & 600 SemiBold, tinggi baris nyaman 1.5 untuk keterbacaan deskripsi produk).
Font Monospace (Harga, SKU & Metrik): 'JetBrains Mono', monospace (Weight: 700 Bold, digunakan pada harga Rp, kode SKU, penghitung stok, dan angka KPI dashboard).
Elemen
Font
Ukuran Mobile (360px)
Ukuran Desktop (1280px+)
Hero Headline (H1)
Space Grotesk
32px (2rem)
56px (3.5rem)
Section Title (H2)
Space Grotesk
22px (1.375rem)
32px (2rem)
Product Card Title
Space Grotesk
18px (1.125rem)
20px (1.25rem)
Harga Rupiah & KPI
JetBrains Mono
18px (1.125rem)
22px (1.375rem)
Body & Deskripsi
Plus Jakarta Sans
14px (0.875rem)
15px (0.9375rem)
Badge & Sticker Tag
JetBrains Mono
11px (0.6875rem)
12px (0.75rem)

3. Aksesibilitas Kontras & Navigasi (Accessibility)
Kontras Teks Tinggi: Teks di atas warna neon (#CCFF00, #00F0FF, #25D366) wajib menggunakan warna hitam pekat #000000 (bukan putih) agar rasio kontras selalu melampaui standar WCAG AAA (> 10:1).
Focus Ring Keyboard: Setiap tombol, input pencarian, dan kartu interaktif memiliki garis fokus kontras tinggi outline: 3px dashed #00F0FF; outline-offset: 3px saat dinavigasi menggunakan tombol Tab.
Target Sentuh Mobile (Touch Target): Seluruh tombol aksi (+ KERANJANG, filter kategori, tombol WhatsApp, tombol CRUD) memiliki tinggi minimal 44px × 44px dengan jarak antar tombol minimal 8px.
Reduced Motion Support: Menghormati preferensi sistem @media (prefers-reduced-motion: reduce) dengan menonaktifkan marquee berjalan dan animasi GSAP/AOS bagi pengguna yang sensitif terhadap gerakan.
4. Spesifikasi Komponen Utama
Top Marquee & Sticky Navbar:
Pita pengumuman berjalan (infinite marquee) di bagian paling atas: "⚡ DUKUNG UMKM LOKAL • DISKON BUNDLING 10% MIN. 3 ITEM • KIRIM LANGSUNG VIA WHATSAPP ⚡".
Navbar lengket (sticky) berisi logo LOKA-KRAFT, tombol pengalih mode instan [ ETALASE KATALOG ] vs [ DASHBOARD TOKO ] (tanpa login palsu), dan tombol 🛒 KERANJANG (0) dengan lencana jumlah item menyala.
Hero Section (Storefront):
Judul besar kontras tinggi dengan stiker miring (rotate(-2deg)) bertuliskan "100% KARYA LOKAL", ringkasan nilai toko, dan statistik cepat (8 PRODUK KURASI • 4 KATEGORI • ORDER INSTAN).
Control Bar (Pencarian, Filter & Sorting):
Input pencarian real-time dengan ikon kaca pembesar dan tombol hapus (X), deretan chip filter kategori (SEMUA, KOPI, KULINER, KRIYA, FESYEN), toggle UNGGULAN & READY STOCK, serta dropdown pengurutan harga (Termurah / Termahal).
Grid Produk & Kartu Brutalist:
Layout responsif: 1 kolom pada mobile (< 640px), 2 kolom pada tablet (640px–1023px), dan 4 kolom pada desktop (>= 1024px).
Setiap kartu menampilkan rasio gambar 4:3 berbingkai hitam, lencana kategori di kiri atas, lencana ★ UNGGULAN di kanan atas, kode SKU & asal daerah, harga Rupiah tebal, indikator stok (STOK: 14 / SISA 2! / HABIS), tombol DETAIL, dan tombol + KERANJANG.
Slide-Over Drawer Keranjang & Tombol WhatsApp:
Panel geser dari kanan berisi daftar item, tombol - / + kuantitas, indikator progres diskon grosir (Tambah 1 item lagi untuk DISKON 10%!), kolom catatan pembeli, dan tombol utama hijau neon 💬 PESAN VIA WHATSAPP + tombol sekunder ⚡ SIMULASI ORDER INSTAN.
Dashboard Demo Pengelola Toko (CRUD):
4 kartu KPI atas (Total Produk, Total Stok, Omzet Simulasi, Stok Menipis), panel Form Tambah / Edit Produk di sisi kiri (atau atas di mobile), dan Tabel Inventaris Produk di sisi kanan dengan aksi cepat Edit, Hapus, Reset Data Awal, dan Export JSON.
5. Wireframe Teks — Tampilan Desktop (1280px+)
+---------------------------------------------------------------------------------------------------+
| ⚡ DUKUNG UMKM LOKAL • DISKON BUNDLING 10% UNTUK PEMBELIAN >= 3 ITEM • ORDER INSTAN WHATSAPP ⚡  |
+---------------------------------------------------------------------------------------------------+
| [LOKA-KRAFT ■]                  [ ETALASE KATALOG ]  [ DASHBOARD TOKO ]         [ 🛒 KERANJANG (2) ] |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |  [★ KURASI UMKM LOKAL] (badge miring -2deg)                                                 |  |
|  |  ETALASE PRODUK LOKAL BERKARAKTER.                                                          |  |
|  |  Temukan kopi sangrai, kuliner artisan, kriya tangan, dan fesyen langsung dari produsen.    |  |
|  |  [ 8 PRODUK AKTIF ]   [ DISKON GROSIR 10% ]   [ TANPA PERANTARA ]                           |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
|  [ 🔍 Cari nama produk, daerah, atau pengrajin... ]   [ Urutkan: Unggulan v ]  [✓ Ready Stock]   |
|  [ SEMUA ]  [ KOPI ]  [ KULINER ]  [ KRIYA ]  [ FESYEN ]  [ ★ UNGGULAN ]                          |
|                                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
|  | [KOPI]    [★ TOP]  |  | [KULINER]          |  | [KRIYA]   [★ TOP]  |  | [FESYEN]           |   |
|  | +----------------+ |  | +----------------+ |  | +----------------+ |  | +----------------+ |   |
|  | |  GAMBAR / SVG  | |  | |  GAMBAR / SVG  | |  | |  GAMBAR / SVG  | |  | |  GAMBAR / SVG  | |   |
|  | +----------------+ |  | +----------------+ |  | +----------------+ |  | +----------------+ |   |
|  | SKU-01 • Kintamani |  | SKU-02 • Gianyar   |  | SKU-03 • Ubud      |  | SKU-04 • Klungkung |   |
|  | Kopi Arabika Roast |  | Sambal Embe Pedas  |  | Mug Keramik Tanah  |  | Pouch Tenun Endek  |   |
|  | Rp 85.000          |  | Rp 45.000          |  | Rp 110.000         |  | Rp 95.000          |   |
|  | STOK: 14           |  | SISA 2! (Magenta)  |  | STOK: 8            |  | STOK: 10           |   |
|  | [DETAIL] [+ KERANJ]|  | [DETAIL] [+ KERANJ]|  | [DETAIL] [+ KERANJ]|  | [DETAIL] [+ KERANJ]|   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
|                                                                                                   |
|  (Baris ke-2: 4 Kartu Produk berikutnya — Total 8 Produk Contoh)                                  |
+---------------------------------------------------------------------------------------------------+


Wireframe Teks — Mode Dashboard Pengelola Toko (Desktop 1280px+)
+---------------------------------------------------------------------------------------------------+
| [LOKA-KRAFT ■]                  [ ETALASE KATALOG ]  [> DASHBOARD TOKO <]       [ 🛒 KERANJANG (2) ] |
+---------------------------------------------------------------------------------------------------+
|  DASHBOARD PENGELOLA TOKO                                        [ ↻ RESET DATA ] [ ↓ EXPORT JSON ]|
|                                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
|  | TOTAL PRODUK       |  | TOTAL UNIT STOK    |  | OMZET SIMULASI     |  | STOK MENIPIS (<=3) |   |
|  | 08 ITEM            |  | 74 UNIT            |  | Rp 425.000         |  | 02 PRODUK (!)      |   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
|                                                                                                   |
|  +----------------------------------+  +-------------------------------------------------------+  |
|  | FORM TAMBAH / EDIT PRODUK        |  | DAFTAR INVENTARIS PRODUK (CRUD)                       |  |
|  | Nama Produk: [_________________] |  | +---------------------------------------------------+ |  |
|  | Kategori   : [KOPI v]            |  | | Kopi Arabika Roast | KOPI | Rp 85.000 | Stok: 14  | |  |
|  | Harga (Rp) : [85000]  Stok: [14] |  | | [★ Unggulan]              [ EDIT ]  [ HAPUS ]     | |  |
|  | URL Gambar : [/assets/kopi.svg]  |  | +---------------------------------------------------+ |  |
|  | Deskripsi  : [_________________] |  | | Sambal Embe Pedas  | KULINER | Rp 45.000 | Stok: 2| |  |
|  | [✓] Tandai sebagai Unggulan      |  | | [!] Stok Menipis          [ EDIT ]  [ HAPUS ]     | |  |
|  |                                  |  | +---------------------------------------------------+ |  |
|  | [ + SIMPAN PRODUK ]  [ BATAL ]   |  | (Tabel responsif seluruh produk di localStorage)     |  |
|  +----------------------------------+  +-------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+


6. Wireframe Teks — Tampilan Mobile (360px – 414px)
+---------------------------------------+
| ⚡ DISKON BUNDLING 10% MIN. 3 ITEM ⚡ |
+---------------------------------------+
| [LOKA-KRAFT ■]            [ 🛒 (2) ]  |
| [ ETALASE ]       [ DASHBOARD TOKO ]  |
+---------------------------------------+
| +-----------------------------------+ |
| | [★ KURASI UMKM LOKAL]             | |
| | ETALASE PRODUK                    | |
| | LOKAL BERKARAKTER.                | |
| | 8 Produk Kurasi • Order WhatsApp  | |
| +-----------------------------------+ |
|                                       |
| [ 🔍 Cari produk UMKM...            ] |
| [ Urutkan: Harga Termurah v         ] |
| <- [SEMUA] [KOPI] [KULINER] [KRIYA]-> |
| (Horizontal scroll filter chips)      |
|                                       |
| +-----------------------------------+ |
| | [KOPI]                  [★ TOP]   | |
| | +-------------------------------+ | |
| | |      GAMBAR / SVG (4:3)       | | |
| | +-------------------------------+ | |
| | SKU-01 • Kintamani, Bali          | |
| | Kopi Arabika Kintamani Roast      | |
| | Rp 85.000             STOK: 14    | |
| | [ DETAIL ]      [ + KERANJANG ]   | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | [KULINER]             [SISA 2!]   | |
| | +-------------------------------+ | |
| | |      GAMBAR / SVG (4:3)       | | |
| | +-------------------------------+ | |
| | SKU-02 • Gianyar, Bali            | |
| | Sambal Embe Artisan Pedas         | |
| | Rp 45.000              STOK: 2    | |
| | [ DETAIL ]      [ + KERANJANG ]   | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | SLIDE-UP DRAWER KERANJANG (SAAT   | |
| | TOMBOL 🛒 DIKLIK)                 | |
| | --------------------------------- | |
| | 1. Kopi Arabika (2x)   Rp 170.000 | |
| | 2. Sambal Embe  (1x)   Rp  45.000 | |
| | Diskon Bundling (10%) -Rp  21.500 | |
| | TOTAL AKHIR:           Rp 193.500 | |
| | Catatan: [______________________] | |
| | [ 💬 PESAN VIA WHATSAPP         ] | |
| | [ ⚡ SIMULASI ORDER INSTAN      ] | |
| +-----------------------------------+ |
+---------------------------------------+


