import './style.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Chart } from 'chart.js/auto';
import { loadProducts, saveProducts, loadOrders, saveOrders, loadCart, saveCart } from './utils/storage.js';
import { validateProduct, escapeHTML, sanitizeUrl } from './utils/security.js';
import { formatRupiah } from './utils/formatters.js';
import { seedProducts, CATEGORIES } from './data/seedProducts.js';

// ---------- State ----------
const state = {
  view: 'storefront', // 'storefront' | 'dashboard' | 'login'
  products: [],
  orders: [],
  cart: [],
  search: '',
  category: 'SEMUA',
  onlyReady: false,
  onlyFeatured: false,
  sort: 'unggulan',
  editingId: null,
  adminAuthed: sessionStorage.getItem('lk_admin_authed') === '1',
  loginAttempts: 0,
  lockUntil: 0,
  chart: null,
};

function initSeed() {
  state.products = loadProducts();
  if (!Array.isArray(state.products) || state.products.length === 0) {
    state.products = [...seedProducts];
    saveProducts(state.products);
  }
  state.orders = loadOrders();
  state.cart = loadCart();
}

// ---------- Security helpers ----------
function sanitizeInput(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------- Helpers ----------
function findProduct(id) {
  return state.products.find((p) => p.id === id);
}

function cartCount() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

function cartSubtotal() {
  return state.cart.reduce((s, i) => {
    const p = findProduct(i.productId);
    const harga = p ? p.harga : i.harga;
    return s + harga * i.qty;
  }, 0);
}

function lowStockProducts() {
  return state.products.filter((p) => p.stok > 0 && p.stok <= 3);
}

function totalStock() {
  return state.products.reduce((s, p) => s + (Number(p.stok) || 0), 0);
}

function simulatedRevenue() {
  return state.orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
}

// ---------- Filtering ----------
function filteredProducts() {
  let list = [...state.products];
  const q = state.search.trim().toLowerCase();
  if (q) {
    list = list.filter((p) =>
      String(p.nama).toLowerCase().includes(q) ||
      String(p.deskripsi).toLowerCase().includes(q) ||
      String(p.kategori).toLowerCase().includes(q) ||
      String(p.id).toLowerCase().includes(q)
    );
  }
  if (state.category !== 'SEMUA') {
    list = list.filter((p) => p.kategori === state.category);
  }
  if (state.onlyReady) {
    list = list.filter((p) => Number(p.stok) > 0);
  }
  if (state.onlyFeatured) {
    list = list.filter((p) => Boolean(p.unggulan));
  }
  switch (state.sort) {
    case 'termurah':
      list.sort((a, b) => a.harga - b.harga);
      break;
    case 'termahal':
      list.sort((a, b) => b.harga - a.harga);
      break;
    case 'stok':
      list.sort((a, b) => b.stok - a.stok);
      break;
    default:
      list.sort((a, b) => Number(b.unggulan) - Number(a.unggulan));
  }
  return list;
}

// ---------- Render router ----------
const appRoot = () => document.querySelector('#app');

function render() {
  if (state.view === 'dashboard' && !state.adminAuthed) {
    state.view = 'login';
  }
  const root = appRoot();
  if (state.view === 'login') root.innerHTML = renderLogin();
  else if (state.view === 'dashboard') root.innerHTML = renderDashboard();
  else root.innerHTML = renderStorefront();
  attachEvents();
  AOS.refresh();
  animateEntrance();
}

// ---------- Marquee ----------
function marqueeHTML() {
  const items = ['DUKUNG UMKM LOKAL', 'DISKON BUNDLING 10% MIN. 3 ITEM', 'KIRIM LANGSUNG VIA WHATSAPP'];
  const doubled = [...items, ...items];
  return `
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        ${doubled.map((t) => `<span>${sanitizeInput(t)}</span>`).join('')}
      </div>
    </div>
  `;
}

// ---------- Navbar ----------
function navbarHTML() {
  return `
    <header class="navbar" role="banner">
      <a class="navbar-brand" href="#" data-nav="storefront">LOKA-KRAFT</a>
      <nav class="navbar-nav" aria-label="Navigasi utama">
        <a href="#" data-nav="storefront">Etalase</a>
        <a href="#" data-nav="dashboard">Dashboard</a>
      </nav>
      <button class="cart-pill" type="button" data-action="open-cart">KERANJANG (${cartCount()})</button>
    </header>
  `;
}

// ---------- Storefront ----------
function renderStorefront() {
  const products = filteredProducts();
  const totalProducts = state.products.length;
  const totalCategories = new Set(state.products.map((p) => p.kategori)).size;

  const productCards = products.map((product, index) => {
    const v = validateProduct(product);
    if (!v.valid) return '';
    const p = v.product;
    const low = p.stok > 0 && p.stok <= 3;
    const out = p.stok === 0;
    const stockLabel = out ? 'HABIS' : low ? `SISA ${p.stok}!` : `STOK: ${p.stok}`;
    return `
      <article class="product-card" data-aos="fade-up" data-aos-delay="${Math.min(index * 60, 400)}" data-product-id="${escapeHTML(p.id)}">
        <div class="product-media">
          <img src="${escapeHTML(p.imageUrl || '')}" alt="${escapeHTML(p.nama)}" loading="lazy" onerror="this.src='/assets/prod-001.svg'" />
          <span class="product-badge product-badge--category">${escapeHTML(p.kategori)}</span>
          ${p.unggulan ? '<span class="product-badge product-badge--featured">UNGGULAN</span>' : ''}
        </div>
        <div class="product-body">
          <p class="product-sku">${escapeHTML(p.id.toUpperCase())}</p>
          <h2 class="product-name">${escapeHTML(p.nama)}</h2>
          <p class="product-description">${escapeHTML(p.deskripsi)}</p>
          <p class="product-price">${formatRupiah(p.harga)}</p>
          <p class="product-stock ${low ? 'low' : ''} ${out ? 'out' : ''}">${escapeHTML(stockLabel)}</p>
          <div class="product-actions">
            <button class="btn-detail" type="button" data-action="detail" data-id="${escapeHTML(p.id)}">DETAIL</button>
            <button class="btn-add" type="button" data-action="add-cart" data-id="${escapeHTML(p.id)}" ${out ? 'disabled' : ''}>+ KERANJANG</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const emptyState = products.length === 0
    ? `<div class="empty-state"><p>Tidak ada produk yang cocok.</p><button class="btn-add" type="button" data-action="reset-filters">RESET FILTER</button></div>`
    : '';

  return `
    ${marqueeHTML()}
    ${navbarHTML()}
    <main class="storefront" id="beranda">
      <section class="hero" aria-labelledby="hero-title" data-aos="zoom-in">
        <div class="hero-motion" aria-hidden="true">
          <svg class="hero-shapes" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <circle class="shape shape--a" cx="120" cy="120" r="60" />
            <circle class="shape shape--b" cx="680" cy="260" r="90" />
            <rect class="shape shape--c" x="360" y="60" width="16" height="280" />
            <polygon class="shape shape--d" points="260,320 320,220 380,320" />
            <polygon class="shape shape--e" points="500,80 560,180 440,180" />
          </svg>
          <div class="hero-grid" aria-hidden="true"></div>
        </div>
        <div class="hero-content">
          <div class="hero-sticker" data-aos="fade-down" data-aos-delay="100">100% KARYA LOKAL</div>
          <h2 id="hero-title" class="hero-title" data-aos="fade-up" data-aos-delay="200">Etalase produk lokal berkarakter.</h2>
          <p class="hero-lead" data-aos="fade-up" data-aos-delay="300">Temukan kopi sangrai, kuliner artisan, kriya tangan, dan fesyen langsung dari produsen.</p>
          <ul class="hero-stats" data-aos="fade-up" data-aos-delay="400">
            <li><strong class="counter" data-target="${totalProducts}">0</strong><span>PRODUK AKTIF</span></li>
            <li><strong class="counter" data-target="${totalCategories}">0</strong><span>KATEGORI</span></li>
            <li><strong>10%</strong><span>DISKON GROSIR</span></li>
          </ul>
        </div>
      </section>

      <section class="control-bar" data-aos="fade-up">
        <div class="search-box">
          <input type="search" placeholder="Cari nama produk, daerah, atau pengrajin..." value="${sanitizeInput(state.search)}" data-action="search" aria-label="Pencarian produk" />
          ${state.search ? '<button type="button" class="btn-clear" data-action="clear-search" aria-label="Hapus pencarian">x</button>' : ''}
        </div>
        <div class="filter-row">
          <div class="chip-group" role="group" aria-label="Filter kategori">
            ${['SEMUA', ...CATEGORIES].map((c) => `<button type="button" class="chip ${state.category === c ? 'active' : ''}" data-action="filter-cat" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('')}
          </div>
          <div class="toggle-group">
            <label class="toggle"><input type="checkbox" ${state.onlyReady ? 'checked' : ''} data-action="toggle-ready" /> Ready stock</label>
            <label class="toggle"><input type="checkbox" ${state.onlyFeatured ? 'checked' : ''} data-action="toggle-featured" /> Unggulan</label>
          </div>
          <select class="sort-select" data-action="sort" aria-label="Urutan produk">
            <option value="unggulan" ${state.sort === 'unggulan' ? 'selected' : ''}>Unggulan</option>
            <option value="termurah" ${state.sort === 'termurah' ? 'selected' : ''}>Harga termurah</option>
            <option value="termahal" ${state.sort === 'termahal' ? 'selected' : ''}>Harga termahal</option>
            <option value="stok" ${state.sort === 'stok' ? 'selected' : ''}>Stok terbanyak</option>
          </select>
        </div>
      </section>

      <section class="product-grid" id="katalog" aria-label="Katalog Produk">
        ${productCards || ''}
      </section>
      ${emptyState}

      <section class="about" id="tentang" aria-labelledby="about-title" data-aos="fade-up">
        <h2 id="about-title" class="section-title">Tentang LOKA-KRAFT</h2>
        <p class="about-lead">LOKA-KRAFT adalah etalase digital untuk produk UMKM lokal. Semua data tersimpan di peramban Anda, tanpa server, tanpa login.</p>
        <div class="about-grid">
          <article class="about-card"><h3>Kurasi lokal</h3><p>Produk dipilih dari pengrajin kopi, kuliner, kriya, dan fesyen dengan asal daerah yang jelas.</p></article>
          <article class="about-card"><h3>Transparan</h3><p>Harga, stok, dan kode SKU ditampilkan apa adanya agar pembeli bisa memutuskan dengan cepat.</p></article>
          <article class="about-card"><h3>Langsung pesan</h3><p>Checkout via WhatsApp dengan rincian belanja otomatis, termasuk diskon bundling 10% untuk tiga item atau lebih.</p></article>
        </div>
      </section>

      <section class="features" id="fitur" aria-labelledby="features-title" data-aos="fade-up">
        <h2 id="features-title" class="section-title">Fitur utama</h2>
        <div class="features-grid">
          <article class="feature-card"><h3>Pencarian real-time</h3><p>Saring produk berdasarkan nama, daerah, atau pengrajin secara instan.</p></article>
          <article class="feature-card"><h3>Filter &amp; urutan</h3><p>Filter kategori, stok tersedia, produk unggulan, dan urutkan harga.</p></article>
          <article class="feature-card"><h3>Keranjang belanja</h3><p>Hitung subtotal dan diskon bundling otomatis saat menambah item.</p></article>
          <article class="feature-card"><h3>Dashboard toko</h3><p>Kelola produk, stok, dan pesanan langsung dari peramban.</p></article>
        </div>
      </section>
    </main>

    <div class="cart-drawer" id="cart-drawer" aria-hidden="true">
      <div class="cart-backdrop" data-action="close-cart"></div>
      <aside class="cart-panel" role="dialog" aria-label="Keranjang belanja">
        <header class="cart-header">
          <h2>KERANJANG</h2>
          <button type="button" class="btn-close" data-action="close-cart" aria-label="Tutup keranjang">x</button>
        </header>
        <div class="cart-body" id="cart-body"></div>
        <footer class="cart-footer" id="cart-footer"></footer>
      </aside>
    </div>

    <div class="modal" id="product-modal" aria-hidden="true">
      <div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal-panel" role="dialog" aria-label="Detail produk"></div>
    </div>

    ${renderFooter()}
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-grid">
        <div class="footer-col">
          <p class="footer-brand">LOKA-KRAFT</p>
          <p class="footer-note">Katalog UMKM lokal. Data tersimpan di peramban. Tanpa backend, tanpa API key.</p>
        </div>
        <div class="footer-col">
          <h3>Navigasi</h3>
          <nav class="footer-nav" aria-label="Tautan footer">
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang</a>
            <a href="#fitur">Fitur</a>
            <a href="#katalog">Katalog</a>
          </nav>
        </div>
        <div class="footer-col">
          <h3>Informasi</h3>
          <p class="footer-note">Neon Brutalism. Aksesibel. Responsif. Tanpa login.</p>
        </div>
      </div>
      <p class="footer-copy">XSS-SANITIZED • INPUT-VALIDATED • CSP-READY</p>
    </footer>
  `;
}

// ---------- Cart drawer ----------
function renderCart() {
  const body = document.querySelector('#cart-body');
  const footer = document.querySelector('#cart-footer');
  if (!body || !footer) return;

  if (state.cart.length === 0) {
    body.innerHTML = `<p class="cart-empty">Keranjang kosong.</p>`;
    footer.innerHTML = '';
    return;
  }

  const rows = state.cart.map((item) => {
    const p = findProduct(item.productId);
    const harga = p ? p.harga : item.harga;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${escapeHTML(item.nama)}</p>
          <p class="cart-item-price">${formatRupiah(harga)}</p>
        </div>
        <div class="cart-item-qty">
          <button type="button" data-action="qty-dec" data-id="${escapeHTML(item.productId)}">-</button>
          <span>${item.qty}</span>
          <button type="button" data-action="qty-inc" data-id="${escapeHTML(item.productId)}">+</button>
        </div>
        <button type="button" class="btn-remove" data-action="remove-cart" data-id="${escapeHTML(item.productId)}" aria-label="Hapus item">x</button>
      </div>
    `;
  }).join('');

  body.innerHTML = rows;

  const subtotal = cartSubtotal();
  const totalQty = cartCount();
  const diskon = totalQty >= 3 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - diskon;

  footer.innerHTML = `
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><strong>${formatRupiah(subtotal)}</strong></div>
      ${diskon > 0 ? `<div class="summary-row discount"><span>Diskon bundling 10%</span><strong>-${formatRupiah(diskon)}</strong></div>` : `<div class="summary-row hint"><span>Tambah ${3 - totalQty} item lagi untuk diskon 10%</span></div>`}
      <div class="summary-row total"><span>Total</span><strong id="cart-total">${formatRupiah(total)}</strong></div>
    </div>
    <textarea class="cart-note" placeholder="Catatan pembeli..." data-action="cart-note">${escapeHTML(state.cartNote || '')}</textarea>
    <div class="cart-actions">
      <button type="button" class="btn-wa" data-action="wa-checkout">PESAN VIA WHATSAPP</button>
      <button type="button" class="btn-sim" data-action="simulate-order">SIMULASI ORDER INSTAN</button>
    </div>
  `;
}

// ---------- Login ----------
function renderLogin() {
  const locked = Date.now() < state.lockUntil;
  const remaining = locked ? Math.ceil((state.lockUntil - Date.now()) / 1000) : 0;
  return `
    ${marqueeHTML()}
    ${navbarHTML()}
    <main class="login-wrap">
      <section class="login-card" data-aos="zoom-in">
        <h2 class="section-title">LOGIN ADMIN</h2>
        <p class="about-lead">Masukkan PIN demo untuk mengakses dashboard.</p>
        <p class="login-hint">Demo PIN: 2026</p>
        ${locked ? `<p class="lock-msg">Terkunci. Coba lagi dalam ${remaining} detik.</p>` : ''}
        <form class="login-form" data-action="login-submit">
          <input type="password" name="pin" placeholder="PIN" maxlength="10" ${locked ? 'disabled' : ''} aria-label="PIN admin" />
          <button type="submit" class="btn-add" ${locked ? 'disabled' : ''}>MASUK</button>
        </form>
        <p class="login-error" id="login-error"></p>
      </section>
    </main>
    ${renderFooter()}
  `;
}

// ---------- Dashboard ----------
function renderDashboard() {
  const kpiCards = `
    <div class="kpi-grid">
      <article class="kpi-card" data-aos="fade-up"><h3>TOTAL PRODUK</h3><p class="kpi-value">${state.products.length}</p></article>
      <article class="kpi-card" data-aos="fade-up" data-aos-delay="80"><h3>TOTAL STOK</h3><p class="kpi-value">${totalStock()}</p></article>
      <article class="kpi-card" data-aos="fade-up" data-aos-delay="160"><h3>OMZET SIMULASI</h3><p class="kpi-value" id="kpi-revenue">${formatRupiah(simulatedRevenue())}</p></article>
      <article class="kpi-card" data-aos="fade-up" data-aos-delay="240"><h3>STOK MENIPIS</h3><p class="kpi-value">${lowStockProducts().length}</p></article>
    </div>
  `;

  const form = renderProductForm();
  const table = renderInventoryTable();
  const orders = renderOrdersTable();

  return `
    ${marqueeHTML()}
    ${navbarHTML()}
    <main class="dashboard" id="dashboard">
      <header class="dash-header">
        <h1 class="section-title">DASHBOARD PENGELOLA TOKO</h1>
        <div class="dash-actions">
          <button type="button" class="btn-add" data-action="reset-data">RESET DATA</button>
          <button type="button" class="btn-add" data-action="export-json">EXPORT JSON</button>
          <label class="btn-add import-label">IMPORT JSON<input type="file" accept="application/json" data-action="import-json" hidden /></label>
          <button type="button" class="btn-close" data-action="logout">LOGOUT</button>
        </div>
      </header>
      ${kpiCards}
      <section class="chart-section" data-aos="fade-up">
        <h2 class="section-title">DISTRIBUSI STOK PER KATEGORI</h2>
        <canvas id="stock-chart" height="120"></canvas>
      </section>
      <div class="dash-grid">
        <section class="dash-form-wrap" data-aos="fade-right">${form}</section>
        <section class="dash-table-wrap" data-aos="fade-left">${table}</section>
      </div>
      <section class="orders-section" data-aos="fade-up">
        <h2 class="section-title">PESANAN MASUK</h2>
        ${orders}
      </section>
    </main>
    ${renderFooter()}
  `;
}

function renderProductForm() {
  const p = state.editingId ? findProduct(state.editingId) : null;
  const val = (key, fallback = '') => (p ? p[key] : fallback);
  return `
    <form class="product-form" data-action="product-submit">
      <h2 class="form-title">${p ? 'EDIT PRODUK' : 'TAMBAH PRODUK'}</h2>
      <label>Nama produk<input type="text" name="nama" maxlength="80" value="${escapeHTML(val('nama'))}" required /></label>
      <label>Kategori
        <select name="kategori" required>
          ${CATEGORIES.map((c) => `<option value="${c}" ${val('kategori') === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </label>
      <div class="form-row">
        <label>Harga (Rp)<input type="number" name="harga" min="0" step="1" value="${escapeHTML(String(val('harga', 0)))}" required /></label>
        <label>Stok<input type="number" name="stok" min="0" step="1" value="${escapeHTML(String(val('stok', 0)))}" required /></label>
      </div>
      <label>URL gambar<input type="text" name="imageUrl" value="${escapeHTML(val('imageUrl') || '')}" placeholder="/assets/prod-001.svg" /></label>
      <label>Deskripsi<textarea name="deskripsi" maxlength="300" rows="3">${escapeHTML(val('deskripsi'))}</textarea></label>
      <label class="toggle"><input type="checkbox" name="unggulan" ${val('unggulan') ? 'checked' : ''} /> Tandai sebagai unggulan</label>
      <div class="form-actions">
        <button type="submit" class="btn-add">${p ? 'SIMPAN PERUBAHAN' : '+ SIMPAN PRODUK'}</button>
        ${p ? '<button type="button" class="btn-close" data-action="cancel-edit">BATAL</button>' : ''}
      </div>
    </form>
  `;
}

function renderInventoryTable() {
  const rows = state.products.map((p) => `
    <tr>
      <td>${escapeHTML(p.nama)}</td>
      <td>${escapeHTML(p.kategori)}</td>
      <td>${formatRupiah(p.harga)}</td>
      <td>${escapeHTML(String(p.stok))}</td>
      <td>
        <button type="button" class="btn-small" data-action="edit-product" data-id="${escapeHTML(p.id)}">EDIT</button>
        <button type="button" class="btn-small btn-danger" data-action="delete-product" data-id="${escapeHTML(p.id)}">HAPUS</button>
      </td>
    </tr>
  `).join('');
  return `
    <div class="table-wrap">
      <table class="inventory-table">
        <thead><tr><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderOrdersTable() {
  if (state.orders.length === 0) return `<p class="empty-state">Belum ada pesanan masuk.</p>`;
  const rows = state.orders.map((o) => `
    <tr>
      <td>${escapeHTML(o.id)}</td>
      <td>${escapeHTML(o.namaPembeli || 'Pelanggan')}</td>
      <td>${formatRupiah(o.total)}</td>
      <td><span class="status-badge status-${escapeHTML(o.status)}">${escapeHTML(o.status)}</span></td>
      <td>
        <button type="button" class="btn-small" data-action="advance-order" data-id="${escapeHTML(o.id)}">LANJUT STATUS</button>
      </td>
    </tr>
  `).join('');
  return `
    <div class="table-wrap">
      <table class="inventory-table">
        <thead><tr><th>ID</th><th>Pembeli</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// ---------- Events ----------
function attachEvents() {
  const root = appRoot();

  root.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const view = el.getAttribute('data-nav');
      if (view === 'dashboard') {
        if (!state.adminAuthed) state.view = 'login';
        else state.view = 'dashboard';
      } else {
        state.view = 'storefront';
      }
      render();
    });
  });

  root.querySelectorAll('[data-action]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const action = el.getAttribute('data-action');
      handleAction(action, el, e);
    });
  });

  // search input
  const searchInput = root.querySelector('input[data-action="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      render();
    });
  }
  const sortSelect = root.querySelector('select[data-action="sort"]');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });
  }
  const cartNote = root.querySelector('textarea[data-action="cart-note"]');
  if (cartNote) {
    cartNote.addEventListener('input', (e) => {
      state.cartNote = e.target.value;
      saveCart(state.cart);
    });
  }
  const fileInput = root.querySelector('input[data-action="import-json"]');
  if (fileInput) {
    fileInput.addEventListener('change', handleImport);
  }

  // login form
  const loginForm = root.querySelector('form[data-action="login-submit"]');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  const productForm = root.querySelector('form[data-action="product-submit"]');
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }

  // cart render if open
  renderCart();

  // chart
  if (state.view === 'dashboard') {
    renderChart();
  }

  // counters
  animateCounters();
}

function handleAction(action, el, e) {
  switch (action) {
    case 'open-cart':
      openCart();
      break;
    case 'close-cart':
      closeCart();
      break;
    case 'add-cart':
      addToCart(el.getAttribute('data-id'));
      break;
    case 'detail':
      openProductModal(el.getAttribute('data-id'));
      break;
    case 'close-modal':
      closeModal();
      break;
    case 'remove-cart':
      removeFromCart(el.getAttribute('data-id'));
      break;
    case 'qty-inc':
      changeQty(el.getAttribute('data-id'), 1);
      break;
    case 'qty-dec':
      changeQty(el.getAttribute('data-id'), -1);
      break;
    case 'clear-search':
      state.search = '';
      render();
      break;
    case 'filter-cat':
      state.category = el.getAttribute('data-cat');
      render();
      break;
    case 'toggle-ready':
      state.onlyReady = el.checked;
      render();
      break;
    case 'toggle-featured':
      state.onlyFeatured = el.checked;
      render();
      break;
    case 'reset-filters':
      state.search = '';
      state.category = 'SEMUA';
      state.onlyReady = false;
      state.onlyFeatured = false;
      state.sort = 'unggulan';
      render();
      break;
    case 'wa-checkout':
      whatsappCheckout();
      break;
    case 'simulate-order':
      simulateOrder();
      break;
    case 'edit-product':
      state.editingId = el.getAttribute('data-id');
      render();
      break;
    case 'cancel-edit':
      state.editingId = null;
      render();
      break;
    case 'delete-product':
      deleteProduct(el.getAttribute('data-id'));
      break;
    case 'reset-data':
      resetData();
      break;
    case 'export-json':
      exportJSON();
      break;
    case 'advance-order':
      advanceOrder(el.getAttribute('data-id'));
      break;
    case 'logout':
      state.adminAuthed = false;
      sessionStorage.removeItem('lk_admin_authed');
      state.view = 'storefront';
      render();
      break;
  }
}

// ---------- Cart logic ----------
function openCart() {
  const drawer = document.querySelector('#cart-drawer');
  if (drawer) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    renderCart();
  }
}
function closeCart() {
  const drawer = document.querySelector('#cart-drawer');
  if (drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }
}

function addToCart(id) {
  const p = findProduct(id);
  if (!p || p.stok <= 0) return;
  const existing = state.cart.find((i) => i.productId === id);
  if (existing) {
    if (existing.qty < p.stok) existing.qty += 1;
  } else {
    state.cart.push({ productId: id, nama: p.nama, harga: p.harga, qty: 1 });
  }
  saveCart(state.cart);
  render();
  openCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.productId !== id);
  saveCart(state.cart);
  renderCart();
  updateCartPill();
}

function changeQty(id, delta) {
  const item = state.cart.find((i) => i.productId === id);
  if (!item) return;
  const p = findProduct(id);
  const max = p ? p.stok : item.qty;
  item.qty = Math.max(1, Math.min(max, item.qty + delta));
  saveCart(state.cart);
  renderCart();
}

function updateCartPill() {
  const pill = document.querySelector('.cart-pill');
  if (pill) pill.textContent = `KERANJANG (${cartCount()})`;
}

function whatsappCheckout() {
  if (state.cart.length === 0) return;
  const subtotal = cartSubtotal();
  const totalQty = cartCount();
  const diskon = totalQty >= 3 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - diskon;
  const lines = state.cart.map((i) => `- ${i.nama} x${i.qty} = ${formatRupiah(i.harga * i.qty)}`).join('%0A');
  const note = state.cartNote ? `%0A%0ACatatan: ${encodeURIComponent(state.cartNote)}` : '';
  const msg = `Pesanan LOKA-KRAFT%0A${lines}%0A%0ASubtotal: ${formatRupiah(subtotal)}%0ADiskon 10%: -${formatRupiah(diskon)}%0ATotal: ${formatRupiah(total)}${note}`;
  const url = `https://wa.me/6281200000000?text=${msg}`;
  window.open(url, '_blank', 'noopener');
}

function simulateOrder() {
  if (state.cart.length === 0) return;
  // validate stock
  for (const item of state.cart) {
    const p = findProduct(item.productId);
    if (!p || p.stok < item.qty) {
      alert('Stok tidak mencukupi.');
      return;
    }
  }
  const subtotal = cartSubtotal();
  const totalQty = cartCount();
  const diskon = totalQty >= 3 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - diskon;

  // deduct stock
  state.cart.forEach((item) => {
    const p = findProduct(item.productId);
    if (p) p.stok = Math.max(0, p.stok - item.qty);
  });
  saveProducts(state.products);

  // create order
  const order = {
    id: 'ORD-' + Date.now(),
    namaPembeli: 'Pelanggan Walk-In',
    catatan: sanitizeInput(state.cartNote || ''),
    items: state.cart.map((i) => ({ productId: i.productId, nama: i.nama, qty: i.qty, harga: i.harga })),
    subtotal,
    diskon,
    total,
    status: 'PENDING',
    waktu: new Date().toISOString(),
  };
  state.orders.unshift(order);
  saveOrders(state.orders);

  state.cart = [];
  state.cartNote = '';
  saveCart(state.cart);

  // confetti
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#CCFF00', '#FF2A85', '#00F0FF'] });

  closeCart();
  render();
}

// ---------- Product modal ----------
function openProductModal(id) {
  const p = findProduct(id);
  if (!p) return;
  const modal = document.querySelector('#product-modal');
  const panel = modal.querySelector('.modal-panel');
  panel.innerHTML = `
    <button type="button" class="btn-close modal-close" data-action="close-modal" aria-label="Tutup">x</button>
    <div class="modal-media"><img src="${escapeHTML(p.imageUrl || '')}" alt="${escapeHTML(p.nama)}" onerror="this.src='/assets/prod-001.svg'" /></div>
    <div class="modal-body">
      <span class="product-badge product-badge--category">${escapeHTML(p.kategori)}</span>
      <h2 class="product-name">${escapeHTML(p.nama)}</h2>
      <p class="product-sku">${escapeHTML(p.id.toUpperCase())}</p>
      <p class="product-description">${escapeHTML(p.deskripsi)}</p>
      <p class="product-price">${formatRupiah(p.harga)}</p>
      <p class="product-stock ${p.stok <= 3 && p.stok > 0 ? 'low' : ''} ${p.stok === 0 ? 'out' : ''}">${p.stok === 0 ? 'HABIS' : p.stok <= 3 ? `SISA ${p.stok}!` : `STOK: ${p.stok}`}</p>
      <button type="button" class="btn-add" data-action="add-cart" data-id="${escapeHTML(p.id)}" ${p.stok === 0 ? 'disabled' : ''}>+ KERANJANG</button>
    </div>
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  const modal = document.querySelector('#product-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// ---------- Product CRUD ----------
function handleProductSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = state.editingId || 'prod-' + Date.now();
  const candidate = {
    id,
    nama: fd.get('nama'),
    kategori: fd.get('kategori'),
    harga: fd.get('harga'),
    stok: fd.get('stok'),
    deskripsi: fd.get('deskripsi'),
    imageUrl: fd.get('imageUrl'),
    unggulan: fd.get('unggulan') === 'on',
  };
  const v = validateProduct(candidate);
  if (!v.valid) {
    alert(v.errors.join(', '));
    return;
  }
  const product = v.product;
  if (state.editingId) {
    const idx = state.products.findIndex((p) => p.id === state.editingId);
    if (idx >= 0) state.products[idx] = product;
    state.editingId = null;
  } else {
    state.products.push(product);
  }
  saveProducts(state.products);
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#CCFF00', '#00F0FF'] });
  render();
}

function deleteProduct(id) {
  if (!confirm('Hapus produk ini?')) return;
  state.products = state.products.filter((p) => p.id !== id);
  state.cart = state.cart.filter((i) => i.productId !== id);
  saveProducts(state.products);
  saveCart(state.cart);
  render();
}

function resetData() {
  if (!confirm('Reset semua data produk ke awal?')) return;
  state.products = [...seedProducts];
  state.orders = [];
  state.cart = [];
  saveProducts(state.products);
  saveOrders(state.orders);
  saveCart(state.cart);
  render();
}

function exportJSON() {
  const data = JSON.stringify({ products: state.products, orders: state.orders }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lokakraft-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleImport(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (Array.isArray(parsed.products)) {
        state.products = parsed.products;
        saveProducts(state.products);
      }
      if (Array.isArray(parsed.orders)) {
        state.orders = parsed.orders;
        saveOrders(state.orders);
      }
      render();
    } catch {
      alert('File JSON tidak valid.');
    }
  };
  reader.readAsText(file);
}

// ---------- Orders ----------
function advanceOrder(id) {
  const order = state.orders.find((o) => o.id === id);
  if (!order) return;
  const flow = ['PENDING', 'DIPROSES', 'SELESAI'];
  const idx = flow.indexOf(order.status);
  if (idx >= 0 && idx < flow.length - 1) {
    order.status = flow[idx + 1];
    saveOrders(state.orders);
    render();
  }
}

// ---------- Login ----------
function handleLogin(e) {
  e.preventDefault();
  if (Date.now() < state.lockUntil) return;
  const fd = new FormData(e.target);
  const pin = String(fd.get('pin') || '');
  const errEl = document.querySelector('#login-error');
  if (pin === '2026') {
    state.adminAuthed = true;
    sessionStorage.setItem('lk_admin_authed', '1');
    state.loginAttempts = 0;
    state.view = 'dashboard';
    render();
  } else {
    state.loginAttempts += 1;
    if (errEl) errEl.textContent = 'PIN salah.';
    if (state.loginAttempts >= 3) {
      state.lockUntil = Date.now() + 30000;
      state.loginAttempts = 0;
      render();
    }
  }
}

// ---------- Chart ----------
function renderChart() {
  const canvas = document.querySelector('#stock-chart');
  if (!canvas) return;
  if (state.chart) {
    state.chart.destroy();
    state.chart = null;
  }
  const labels = CATEGORIES;
  const data = labels.map((c) => state.products.filter((p) => p.kategori === c).reduce((s, p) => s + (Number(p.stok) || 0), 0));
  state.chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Stok',
        data,
        backgroundColor: ['#CCFF00', '#FF2A85', '#00F0FF', '#FF9900'],
        borderColor: '#000000',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#F4F4F0', font: { family: 'JetBrains Mono' } }, grid: { color: '#232330' } },
        y: { ticks: { color: '#F4F4F0', font: { family: 'JetBrains Mono' } }, grid: { color: '#232330' }, beginAtZero: true },
      },
    },
  });
}

// ---------- Animations ----------
function animateEntrance() {
  AOS.init({ duration: 600, easing: 'ease-out-back', once: true, offset: 60 });
  gsap.from('.navbar', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' });
}

function animateCounters() {
  document.querySelectorAll('.counter').forEach((el) => {
    const target = Number(el.getAttribute('data-target')) || 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); },
    });
  });
  // animate kpi revenue
  const rev = document.querySelector('#kpi-revenue');
  if (rev) {
    // keep formatted text
  }
}

// ---------- Init ----------
initSeed();
render();
AOS.init({ duration: 600, easing: 'ease-out-back', once: true, offset: 60 });