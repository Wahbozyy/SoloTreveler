import './style.css';
import 'aos/dist/aos.css';
import 'leaflet/dist/leaflet.css';
import AOS from 'aos';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import L from 'leaflet';
import { formatRupiah } from './utils/formatters.js';

const SEED_USERS = [
  { id: 'u1', name: 'Ayu', gender: 'F', vibe: 'Chill', budget: 'Mid-range', verified: true },
  { id: 'u2', name: 'Bima', gender: 'M', vibe: 'Adventure', budget: 'Backpacker', verified: true },
  { id: 'u3', name: 'Citra', gender: 'F', vibe: 'Photography', budget: 'Comfort', verified: false },
  { id: 'u4', name: 'Dewa', gender: 'M', vibe: 'Culinary', budget: 'Mid-range', verified: true },
];

const SEED_TRIPS = [
  { id: 'trip-001', title: 'Kintamani Sunrise Jeep + Coffee Tasting', destination_area: 'Kintamani, Bali', start_date: '2026-11-22', end_date: '2026-11-22', meeting_point: 'Ubud Central Parking', lat: -8.242, lng: 115.375, vehicle_type: 'Jeep 4x4 (4 seat)', total_transport_cost: 600000, max_pax: 4, women_only: false, status: 'OPEN', creator_id: 'u1', vibe: 'Adventure', budget_tier: 'Mid-range', members: ['u1','u2'], itinerary: [ { id:'it-1', day_number:1, time_slot:'04:00', place_name:'Penjemputan Ubud', lat:-8.5069, lng:115.2625, estimated_cost:0, votes_count:2, order_index:0, proposed_by:'u1' }, { id:'it-2', day_number:1, time_slot:'05:30', place_name:'Sunrise Point Kintamani', lat:-8.242, lng:115.375, estimated_cost:50000, votes_count:3, order_index:1, proposed_by:'u1' }, { id:'it-3', day_number:1, time_slot:'08:00', place_name:'Kopi Luwak Tasting', lat:-8.25, lng:115.38, estimated_cost:75000, votes_count:1, order_index:2, proposed_by:'u2' } ], expenses: [] },
  { id: 'trip-002', title: 'Nusa Penida Island Hopping Fast Boat', destination_area: 'Nusa Penida, Bali', start_date: '2026-11-25', end_date: '2026-11-25', meeting_point: 'Sanur Beach Port', lat: -8.7278, lng: 115.5444, vehicle_type: 'Private Fast Boat (8 seat)', total_transport_cost: 1200000, max_pax: 8, women_only: true, status: 'OPEN', creator_id: 'u3', vibe: 'Photography', budget_tier: 'Comfort', members: ['u3'], itinerary: [ { id:'it-4', day_number:1, time_slot:'07:00', place_name:'Sanur Port', lat:-8.686, lng:115.263, estimated_cost:0, votes_count:1, order_index:0, proposed_by:'u3' }, { id:'it-5', day_number:1, time_slot:'09:00', place_name:'Kelingking Beach', lat:-8.75, lng:115.47, estimated_cost:25000, votes_count:2, order_index:1, proposed_by:'u3' } ], expenses: [] },
  { id: 'trip-003', title: 'Ubud Rice Terrace & Culinary Walk', destination_area: 'Ubud, Bali', start_date: '2026-11-23', end_date: '2026-11-23', meeting_point: 'Ubud Palace', lat: -8.5069, lng: 115.2625, vehicle_type: 'MPV 6-Seater', total_transport_cost: 450000, max_pax: 6, women_only: false, status: 'OPEN', creator_id: 'u4', vibe: 'Culinary', budget_tier: 'Backpacker', members: ['u4','u1','u2'], itinerary: [ { id:'it-6', day_number:1, time_slot:'09:00', place_name:'Ubud Palace', lat:-8.5069, lng:115.2625, estimated_cost:0, votes_count:3, order_index:0, proposed_by:'u4' }, { id:'it-7', day_number:1, time_slot:'10:30', place_name:'Tegalalang Rice Terrace', lat:-8.431, lng:115.279, estimated_cost:25000, votes_count:2, order_index:1, proposed_by:'u4' } ], expenses: [] },
  { id: 'trip-004', title: 'Uluwatu Sunset Van Tour', destination_area: 'Uluwatu, Bali', start_date: '2026-11-24', end_date: '2026-11-24', meeting_point: 'Seminyak Square', lat: -8.829, lng: 115.085, vehicle_type: 'MPV 6-Seater', total_transport_cost: 500000, max_pax: 6, women_only: false, status: 'OPEN', creator_id: 'u2', vibe: 'Chill', budget_tier: 'Mid-range', members: ['u2','u3'], itinerary: [], expenses: [] },
  { id: 'trip-005', title: 'Mount Batur Sunrise Trek', destination_area: 'Batur, Bali', start_date: '2026-11-26', end_date: '2026-11-26', meeting_point: 'Kintamani Basecamp', lat: -8.242, lng: 115.375, vehicle_type: 'Jeep 4x4 (4 seat)', total_transport_cost: 700000, max_pax: 4, women_only: false, status: 'OPEN', creator_id: 'u1', vibe: 'Adventure', budget_tier: 'Backpacker', members: ['u1'], itinerary: [], expenses: [] },
  { id: 'trip-006', title: 'Canggu Cafe Hopping & Surf', destination_area: 'Canggu, Bali', start_date: '2026-11-27', end_date: '2026-11-27', meeting_point: 'Batu Bolong Beach', lat: -8.647, lng: 115.138, vehicle_type: 'Scooter Convoy (self)', total_transport_cost: 0, max_pax: 5, women_only: false, status: 'OPEN', creator_id: 'u4', vibe: 'Culinary', budget_tier: 'Backpacker', members: ['u4','u2'], itinerary: [], expenses: [] },
];

const state = {
  view: 'discovery',
  currentUser: SEED_USERS[0,  { id: 'trip-007', title: 'Tanah Lot Sunset & Seafood Dinner', destination_area: 'Tanah Lot, Bali', start_date: '2026-11-28', end_date: '2026-11-28', meeting_point: 'Kuta Beach', lat: -8.620, lng: 115.100, vehicle_type: 'MPV 6-Seater', total_transport_cost: 550000, max_pax: 6, women_only: false, status: 'OPEN', creator_id: 'u2', vibe: 'Chill', budget_tier: 'Mid-range', members: ['u2','u4'], itinerary: [], expenses: [] },
  { id: 'trip-008', title: 'Tirta Empul Holy Spring & Rice Fields', destination_area: 'Tampaksiring, Bali', start_date: '2026-11-29', end_date: '2026-11-29', meeting_point: 'Ubud Center', lat: -8.415, lng: 115.315, vehicle_type: 'MPV 6-Seater', total_transport_cost: 400000, max_pax: 5, women_only: true, status: 'OPEN', creator_id: 'u3', vibe: 'Photography', budget_tier: 'Comfort', members: ['u3'], itinerary: [], expenses: [] },
  { id: 'trip-009', title: 'Lempuyang Gate of Heaven Sunrise', destination_area: 'Karangasem, Bali', start_date: '2026-11-30', end_date: '2026-11-30', meeting_point: 'Amlapura', lat: -8.390, lng: 115.620, vehicle_type: 'Jeep 4x4 (4 seat)', total_transport_cost: 800000, max_pax: 4, women_only: false, status: 'OPEN', creator_id: 'u1', vibe: 'Adventure', budget_tier: 'Backpacker', members: ['u1','u3'], itinerary: [], expenses: [] }],
  trips: [],
  users: [...SEED_USERS],
  activeTripId: null,
  filters: { destination: '', vibe: '', womenOnly: false, date: '', quick: '' },
  theme: localStorage.getItem('vibetrip_theme') || 'night',
  simSeats: 4,
  simVehicle: 'Jeep 4x4',
  map: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem('vibetrip_state_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.trips)) state.trips = parsed.trips;
      if (Array.isArray(parsed.users)) state.users = parsed.users;
    } else {
      state.trips = JSON.parse(JSON.stringify(SEED_TRIPS));
      saveState();
    }
  } catch {
    state.trips = JSON.parse(JSON.stringify(SEED_TRIPS));
    saveState();
  }
  if (!state.currentUser) state.currentUser = (state.users && state.users[0]) || SEED_USERS[0];
}
function saveState() {
  try { localStorage.setItem('vibetrip_state_v1', JSON.stringify({ trips: state.trips, users: state.users })); } catch {}
}

function getUser(id) { return state.users.find((u) => u.id === id); }
function getTrip(id) { return state.trips.find((t) => t.id === id); }
function sanitizeInput(v) { if (v===null||v===undefined) return ''; return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
const escapeHTML = sanitizeInput;
function formatIDR(n) { return 'Rp' + Number(n||0).toLocaleString('id-ID'); }

function vibeMatchScore(trip, user) {
  if (!user) user = state.currentUser || SEED_USERS[0];
  const creator = getUser(trip.creator_id);
  let score = 20;
  if (creator && creator.vibe && creator.vibe === user.vibe) score += 30;
  else if (creator) score += 15;
  if (creator && creator.budget && creator.budget === user.budget) score += 25;
  else score += 10;
  if (trip.women_only && user.gender === 'F') score += 10;
  if (trip.vibe === user.vibe) score += 15;
  return Math.min(100, score);
}

function splitCost(trip) {
  const members = trip.members.length || 1;
  return { members, perPerson: Math.ceil(trip.total_transport_cost / members), total: trip.total_transport_cost };
}

function simPrice() {
  const costs = { 'Jeep 4x4': 600000, 'MPV Van': 450000, 'Fast Boat': 1200000 };
  const total = costs[state.simVehicle] || 600000;
  const per = Math.ceil(total / state.simSeats);
  const saving = Math.round((1 - state.simSeats / 4) * 100);
  return { total, per, saving: Math.max(0, saving) };
}

const root = () => document.querySelector('#app');
function render() {
  const r = root();
  if (state.view === 'tripRoom') r.innerHTML = renderTripRoom();
  else if (state.view === 'createTrip') r.innerHTML = renderCreateTrip();
  else r.innerHTML = renderDiscovery();
  applyTheme();
  attachEvents();
  AOS.refresh();
  animateEntrance();
  if (state.view === 'tripRoom') initMap();
  if (state.view === 'discovery') animateSimulator();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('vibetrip_theme', state.theme);
}

function marqueeHTML() {
  const items = ['TEMUKAN TEMAN SEPERJALANAN', 'BAGI BIAYA TRANSPORTASI', 'SUSUN ITINERARY BERSAMA', 'TRAVEL SOLO LEBIH AMAN'];
  const doubled = [...items, ...items];
  return `<div class="marquee" aria-hidden="true"><div class="marquee-track">${doubled.map(t=>`<span>${sanitizeInput(t)}</span>`).join('')}</div></div>`;
}

function navbarHTML() {
  return `
    <header class="navbar" role="banner">
      <div class="navbar-inner">
        <a class="navbar-brand" href="#" data-nav="discovery">VIBETRIP</a>
        <nav class="navbar-nav" aria-label="Navigasi utama">
          <a href="#" data-nav="discovery">Eksplorasi</a>
          <a href="#" data-nav="createTrip">Buat Trip</a>
        </nav>
        <div class="nav-actions">
          <button type="button" class="theme-toggle" data-action="toggle-theme" aria-label="Ganti tema">${state.theme === 'night' ? 'MODE SIANG' : 'MODE MALAM'}</button>
          <span class="cart-pill">${sanitizeInput((state.currentUser && state.currentUser.name) || 'Guest')}</span>
        </div>
      </div>
    </header>
  `;
}

function renderDiscovery() {
  const filtered = state.trips.filter((t) => {
    if (state.filters.destination && !t.destination_area.toLowerCase().includes(state.filters.destination.toLowerCase())) return false;
    if (state.filters.vibe && t.vibe !== state.filters.vibe) return false;
    if (state.filters.womenOnly && !t.women_only) return false;
    if (state.filters.date && t.start_date !== state.filters.date) return false;
    if (state.filters.quick === 'sisa1' && (t.max_pax - t.members.length) !== 1) return false;
    if (state.filters.quick === 'sunrise' && !t.title.toLowerCase().includes('sunrise')) return false;
    if (state.filters.quick === 'island' && !t.title.toLowerCase().includes('island')) return false;
    if (state.filters.quick === 'women' && !t.women_only) return false;
    return true;
  });

  const cards = filtered.map((trip, i) => {
    const sc = splitCost(trip);
    const match = vibeMatchScore(trip, state.currentUser);
    const creator = getUser(trip.creator_id);
    const seatsLeft = trip.max_pax - trip.members.length;
    const slotIndicators = Array.from({ length: trip.max_pax }, (_, k) => k < trip.members.length ? '■' : '□').join(' ');
    return `
      <article class="trip-card" data-aos="fade-up" data-aos-delay="${Math.min(i*60,400)}">
        <div class="trip-card-head">
          <h3 class="trip-title">${escapeHTML(trip.title)}</h3>
          <span class="vibe-badge">${escapeHTML(trip.vibe)}</span>
        </div>
        <p class="trip-dest">${escapeHTML(trip.destination_area)} • ${escapeHTML(trip.start_date)}</p>
        <p class="trip-vehicle">${escapeHTML(trip.vehicle_type)}</p>
        <div class="seat-slots" aria-label="Slot kursi">${slotIndicators} <span class="seat-left">Sisa ${seatsLeft} Kursi</span></div>
        <div class="trip-meta">
          <span class="match-pill">${match}% VIBE MATCH</span>
          <span class="seat-info">${trip.members.length}/${trip.max_pax} Kursi</span>
        </div>
        <div class="cost-split">
          <span class="cost-old">${formatIDR(trip.total_transport_cost)}</span>
          <span class="cost-new">${formatIDR(sc.perPerson)}/org</span>
        </div>
        ${trip.women_only ? '<span class="women-badge">WOMEN-ONLY</span>' : ''}
        <div class="trip-actions">
          <button type="button" class="btn-add" data-action="open-trip" data-id="${escapeHTML(trip.id)}">LIHAT TRIP</button>
          <button type="button" class="btn-detail" data-action="join-trip" data-id="${escapeHTML(trip.id)}">GABUNG</button>
          <button type="button" class="btn-small" data-action="sim-join" data-id="${escapeHTML(trip.id)}">+1 SIMULASI</button>
        </div>
        <p class="trip-creator">Host: ${escapeHTML(creator ? creator.name : 'Anon')} ${creator && creator.verified ? '✓' : ''}</p>
      </article>
    `;
  }).join('');

  const sim = simPrice();
  const simSaving = sim.seats > 1 ? Math.round((1 - 1/sim.seats)*100) : 0;

  return `
    ${marqueeHTML()}
    ${navbarHTML()}
    <main class="discovery">
      <section class="hero" data-aos="zoom-in">
        <div class="hero-left">
          <div class="hero-sticker" data-aos="fade-down" data-aos-delay="100">⚡ LIVE TRIP-MATCHING • BALI & BEYOND</div>
          <h2 class="hero-title" data-aos="fade-up" data-aos-delay="200">TEMUKAN TEMAN JALAN, PATUNGAN TRANSPORT, SUSUN ITINERARY BARENG.</h2>
          <p class="hero-lead" data-aos="fade-up" data-aos-delay="300">Jelajahi trip terbuka di destinasi Anda, cocokkan vibe, dan simulasikan penghematan biaya transportasi secara real-time.</p>
          <div class="hero-cta" data-aos="fade-up" data-aos-delay="400">
            <a href="#trip-feed" class="btn-add">JELAJAHI OPEN TRIP</a>
            <button type="button" class="btn-detail" data-action="open-demo">⚡ COBA SIMULASI LIVE DEMO</button>
          </div>
          <div class="micro-stats" data-aos="fade-up" data-aos-delay="500">
            <div class="stat-box"><strong>128+</strong><span>Solo Travelers Aktif</span></div>
            <div class="stat-box"><strong>62%</strong><span>Rata-rata Hemat Biaya Sewa</span></div>
            <div class="stat-box"><strong>100%</strong><span>Rute Terverifikasi</span></div>
          </div>
        </div>
        <div class="hero-right" data-aos="fade-left" data-aos-delay="300">
          <div class="sim-widget">
            <h3 class="sim-title">MINI SPLIT-COST & VIBE SIMULATOR</h3>
            <label>Kendaraan
              <select data-action="sim-vehicle">
                <option ${state.simVehicle==='Jeep 4x4'?'selected':''}>Jeep 4x4</option>
                <option ${state.simVehicle==='MPV Van'?'selected':''}>MPV Van</option>
                <option ${state.simVehicle==='Fast Boat'?'selected':''}>Fast Boat</option>
              </select>
            </label>
            <label>Jumlah kursi: <strong id="sim-seats-label">${state.simSeats}</strong>
              <input type="range" min="1" max="4" value="${state.simSeats}" data-action="sim-seats" />
            </label>
            <div class="sim-result">
              <div class="sim-total">Total: ${formatIDR(sim.total)}</div>
              <div class="sim-per" id="sim-per">${formatIDR(sim.per)}/org</div>
              ${state.simSeats > 1 ? `<div class="sim-saving" id="sim-saving">HEMAT ${simSaving}%</div>` : ''}
            </div>
          </div>
        </div>
      </section>

      <section class="filter-bar" id="trip-feed" data-aos="fade-up">
        <input type="search" placeholder="Cari destinasi..." value="${escapeHTML(state.filters.destination)}" data-action="filter-dest" />
        <select data-action="filter-vibe">
          <option value="">Semua Vibe</option>
          <option value="Chill" ${state.filters.vibe==='Chill'?'selected':''}>Chill</option>
          <option value="Adventure" ${state.filters.vibe==='Adventure'?'selected':''}>Adventure</option>
          <option value="Photography" ${state.filters.vibe==='Photography'?'selected':''}>Photography</option>
          <option value="Culinary" ${state.filters.vibe==='Culinary'?'selected':''}>Culinary</option>
        </select>
        <label class="toggle"><input type="checkbox" ${state.filters.womenOnly?'checked':''} data-action="filter-women" /> Women-only</label>
        <input type="date" value="${escapeHTML(state.filters.date)}" data-action="filter-date" />
        <div class="quick-pills">
          <button type="button" class="pill ${state.filters.quick==='sisa1'?'active':''}" data-action="quick-filter" data-q="sisa1">Sisa 1 Kursi</button>
          <button type="button" class="pill ${state.filters.quick==='sunrise'?'active':''}" data-action="quick-filter" data-q="sunrise">Sunrise</button>
          <button type="button" class="pill ${state.filters.quick==='island'?'active':''}" data-action="quick-filter" data-q="island">Island Hopping</button>
          <button type="button" class="pill ${state.filters.quick==='women'?'active':''}" data-action="quick-filter" data-q="women">Women-Only</button>
        </div>
      </section>

      <section class="trip-grid">
        ${cards || '<p class="empty-state">Tidak ada trip yang cocok.</p>'}
      </section>

      <section class="bento-section" data-aos="fade-up">
        <h2 class="section-title">CARA KERJA &amp; FITUR UNGGULAN</h2>
        <div class="bento-grid">
          <article class="bento-card" data-aos="fade-up">
            <h3>01. Smart Vibe &amp; Route Matcher</h3>
            <p>Skor kecocokan 0–100% berdasarkan 45% rute &amp; waktu, 30% gaya perjalanan, 25% budget tier.</p>
            <div class="score-breakdown">
              <div class="score-bar"><span>Rute &amp; Waktu</span><div class="bar"><div style="width:45%"></div></div></div>
              <div class="score-bar"><span>Vibe &amp; Pace</span><div class="bar"><div style="width:30%"></div></div></div>
              <div class="score-bar"><span>Budget Tier</span><div class="bar"><div style="width:25%"></div></div></div>
            </div>
          </article>
          <article class="bento-card" data-aos="fade-up" data-aos-delay="100">
            <h3>02. Collaborative Live Itinerary + AI Optimizer</h3>
            <p>Usulkan spot, vote, dan reorder. Klik optimize untuk menyusun ulang rute paling efisien.</p>
            <button type="button" class="btn-small" data-action="demo-optimize">⚡ OPTIMIZE RUTE AI</button>
            <ul class="demo-stops" id="demo-stops">
              <li>Spot C (14:00)</li>
              <li>Spot A (09:00)</li>
              <li>Spot B (11:30)</li>
            </ul>
          </article>
          <article class="bento-card" data-aos="fade-up" data-aos-delay="200">
            <h3>03. Split Expense Ledger</h3>
            <p>Catat pengeluaran patungan, hitung settlement dengan transfer minimal otomatis.</p>
            <div class="settle-preview">
              <p>A → B: Rp25.000</p>
              <p>C → B: Rp15.000</p>
            </div>
          </article>
        </div>
      </section>

      <section class="safety-section" data-aos="fade-up">
        <h2 class="section-title">SAFETY &amp; TRUST</h2>
        <div class="safety-grid">
          <article class="safety-card"><h3>Verifikasi Identitas</h3><p>Email kampus/kerja terverifikasi dan riwayat trip selesai.</p></article>
          <article class="safety-card"><h3>Filter Women-Only</h3><p>Opsi trip khusus sesama gender untuk kenyamanan.</p></article>
          <article class="safety-card"><h3>Emergency Live Trip Pass</h3><p>Tautan read-only berisi rute, kontak sopir, dan peserta.</p>
            <button type="button" class="btn-detail" data-action="preview-pass">PREVIEW EMERGENCY PASS</button>
          </article>
        </div>
      </section>
    </main>

    <div class="modal" id="demo-modal" aria-hidden="true">
      <div class="modal-backdrop" data-action="close-demo"></div>
      <div class="modal-panel" role="dialog" aria-label="Live demo trip">
        <button type="button" class="btn-close modal-close" data-action="close-demo">x</button>
        <h2 class="section-title">LIVE DEMO TRIP ROOM</h2>
        <p class="about-lead">Simulasi trip room interaktif. Coba tambah spot, vote, dan optimize rute.</p>
        <p>Gunakan tombol Lihat Trip pada kartu untuk masuk ke Trip Room lengkap.</p>
      </div>
    </div>

    <div class="modal" id="pass-modal" aria-hidden="true">
      <div class="modal-backdrop" data-action="close-pass"></div>
      <div class="modal-panel" role="dialog" aria-label="Emergency pass">
        <button type="button" class="btn-close modal-close" data-action="close-pass">x</button>
        <h2 class="section-title">EMERGENCY TRIP PASS</h2>
        <div class="pass-card">
          <p><strong>Trip:</strong> Kintamani Sunrise Jeep + Coffee Tasting</p>
          <p><strong>Meeting:</strong> Ubud Central Parking</p>
          <p><strong>Kendaraan:</strong> Jeep 4x4 (4 seat) • B 1234 XYZ</p>
          <p><strong>Sopir:</strong> Pak Wayan • +62 812-0000-0000</p>
          <p><strong>Peserta:</strong> Ayu, Bima</p>
          <p><strong>Rute:</strong> Ubud → Kintamani → Kopi Luwak</p>
        </div>
        <button type="button" class="btn-wa" data-action="share-pass">BAGIKAN KE WHATSAPP</button>
      </div>
    </div>

    ${renderFooter()}
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-grid">
        <div class="footer-col">
          <p class="footer-brand">VIBETRIP</p>
          <p class="footer-note">Solo traveler trip-matcher. Data tersimpan di peramban.</p>
        </div>
        <div class="footer-col">
          <h3>Navigasi</h3>
          <nav class="footer-nav" aria-label="Tautan footer">
            <a href="#trip-feed">Eksplorasi</a>
            <a href="#" data-nav="createTrip">Buat Trip</a>
          </nav>
        </div>
        <div class="footer-col">
          <h3>Destinasi</h3>
          <p class="footer-note">Kintamani • Nusa Penida • Ubud • Uluwatu • Canggu</p>
        </div>
      </div>
      <p class="footer-copy">Built for Solo Travelers</p>
    </footer>
  `;
}

// ---------- Trip Room (same as before) ----------
function renderTripRoom() {
  const trip = getTrip(state.activeTripId);
  if (!trip) { state.view = 'discovery'; return renderDiscovery(); }
  const sc = splitCost(trip);
  const items = [...trip.itinerary].sort((a,b) => a.order_index - b.order_index);
  const expenses = trip.expenses || [];
  const settlement = computeSettlement(trip, expenses);
  return `
    ${marqueeHTML()}
    ${navbarHTML()}
    <main class="trip-room">
      <header class="trip-room-header">
        <button type="button" class="btn-detail" data-action="back-discovery">← KEMBALI</button>
        <h1 class="section-title">${escapeHTML(trip.title)}</h1>
        <p class="about-lead">${escapeHTML(trip.destination_area)} • ${escapeHTML(trip.start_date)} • ${escapeHTML(trip.vehicle_type)}</p>
      </header>
      <div class="trip-room-grid">
        <section class="trip-panel" data-aos="fade-right">
          <h2 class="section-title">Ringkasan &amp; Kalkulator</h2>
          <div id="trip-map" class="trip-map"></div>
          <div class="cost-box">
            <p><strong>Biaya sewa total:</strong> ${formatIDR(trip.total_transport_cost)}</p>
            <p><strong>Peserta:</strong> ${trip.members.length}/${trip.max_pax}</p>
            <p class="cost-per"><strong>Biaya per orang:</strong> ${formatIDR(sc.perPerson)}</p>
          </div>
          <div class="member-list">
            <h3>Peserta</h3>
            ${trip.members.map((m) => { const u = getUser(m); return `<span class="member-chip">${escapeHTML(u?u.name:m)} ${u&&u.verified?'✓':''}</span>`; }).join('')}
          </div>
          <button type="button" class="btn-add" data-action="optimize-ai" data-id="${escapeHTML(trip.id)}">OPTIMIZE ROUTE WITH AI</button>
          <button type="button" class="btn-sim" data-action="trip-brief" data-id="${escapeHTML(trip.id)}">AUTO-GENERATE TRIP BRIEF</button>
          <button type="button" class="btn-wa" data-action="share-trip" data-id="${escapeHTML(trip.id)}">SHARE TRIP (SAFETY LINK)</button>
        </section>
        <section class="trip-panel" data-aos="fade-left">
          <div class="tabs">
            <button type="button" class="tab active" data-tab="itinerary">Itinerary</button>
            <button type="button" class="tab" data-tab="expenses">Split Expense</button>
          </div>
          <div class="tab-content" id="tab-itinerary">
            <h2 class="section-title">Collaborative Itinerary</h2>
            <form class="itinerary-form" data-action="add-itinerary" data-id="${escapeHTML(trip.id)}">
              <input type="text" name="place" placeholder="Nama tempat" required />
              <input type="time" name="time" required />
              <input type="number" name="cost" placeholder="Estimasi biaya" min="0" />
              <button type="submit" class="btn-add">+ TAMBAH SPOT</button>
            </form>
            <div class="itinerary-list">
              ${items.map((it, idx) => `
                <div class="itinerary-item">
                  <div class="it-order">${idx + 1}</div>
                  <div class="it-body">
                    <p class="it-place">${escapeHTML(it.place_name)}</p>
                    <p class="it-meta">${escapeHTML(it.time_slot)} • ${formatIDR(it.estimated_cost)}</p>
                  </div>
                  <div class="it-actions">
                    <button type="button" class="btn-small" data-action="vote-it" data-trip="${escapeHTML(trip.id)}" data-it="${escapeHTML(it.id)}">▲ ${it.votes_count}</button>
                    <button type="button" class="btn-small" data-action="move-up" data-trip="${escapeHTML(trip.id)}" data-it="${escapeHTML(it.id)}">↑</button>
                    <button type="button" class="btn-small" data-action="move-down" data-trip="${escapeHTML(trip.id)}" data-it="${escapeHTML(it.id)}">↓</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="tab-content" id="tab-expenses" style="display:none">
            <h2 class="section-title">Split Expense</h2>
            <form class="expense-form" data-action="add-expense" data-id="${escapeHTML(trip.id)}">
              <input type="text" name="title" placeholder="Judul pengeluaran" required />
              <input type="number" name="amount" placeholder="Jumlah" min="0" required />
              <select name="paidBy">
                ${trip.members.map((m) => { const u = getUser(m); return `<option value="${escapeHTML(m)}">${escapeHTML(u?u.name:m)}</option>`; }).join('')}
              </select>
              <button type="submit" class="btn-add">+ CATAT</button>
            </form>
            <div class="expense-list">
              ${expenses.map((ex) => { const u = getUser(ex.paid_by); return `<div class="expense-item"><span>${escapeHTML(ex.title)}</span><span>${formatIDR(ex.amount)}</span><span class="expense-payer">dibayar ${escapeHTML(u?u.name:ex.paid_by)}</span></div>`; }).join('') || '<p class="empty-state">Belum ada pengeluaran.</p>'}
            </div>
            <div class="settlement">
              <h3>Settlement (transfer minimal)</h3>
              ${settlement.length ? settlement.map((s) => `<p>${escapeHTML(s.from)} → ${escapeHTML(s.to)}: ${formatIDR(s.amount)}</p>`).join('') : '<p>Semua lunas.</p>'}
            </div>
          </div>
        </section>
      </div>
    </main>
    ${renderFooter()}
  `;
}

function computeSettlement(trip, expenses) {
  const members = trip.members;
  const balance = {};
  members.forEach((m) => (balance[m] = 0));
  expenses.forEach((ex) => {
    const share = ex.amount / members.length;
    members.forEach((m) => {
      if (m === ex.paid_by) balance[m] += ex.amount - share;
      else balance[m] -= share;
    });
  });
  const debtors = members.filter((m) => balance[m] < -0.01).map((m) => ({ id: m, amt: -balance[m] }));
  const creditors = members.filter((m) => balance[m] > 0.01).map((m) => ({ id: m, amt: balance[m] }));
  const result = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    result.push({ from: getUser(debtors[i].id)?.name || debtors[i].id, to: getUser(creditors[j].id)?.name || creditors[j].id, amount: Math.round(pay) });
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt < 0.01) i++;
    if (creditors[j].amt < 0.01) j++;
  }
  return result;
}

function renderCreateTrip() {
  return `
    ${marqueeHTML()}
    ${navbarHTML()}
    <main class="create-trip">
      <h1 class="section-title">BUAT TRIP BARU</h1>
      <form class="trip-form" data-action="create-trip-submit">
        <label>Judul trip<input type="text" name="title" required maxlength="80" /></label>
        <label>Destinasi<input type="text" name="destination" required maxlength="60" /></label>
        <label>Tanggal mulai<input type="date" name="startDate" required /></label>
        <label>Titik kumpul<input type="text" name="meeting" required maxlength="80" /></label>
        <label>Latitude<input type="number" step="0.0001" name="lat" value="-8.5" /></label>
        <label>Longitude<input type="number" step="0.0001" name="lng" value="115.2" /></label>
        <label>Jenis kendaraan<input type="text" name="vehicle" required maxlength="40" /></label>
        <label>Total biaya sewa (Rp)<input type="number" name="cost" min="0" required /></label>
        <label>Kapasitas maksimal<input type="number" name="maxpax" min="1" max="20" value="4" required /></label>
        <label>Vibe<select name="vibe"><option>Chill</option><option>Adventure</option><option>Photography</option><option>Culinary</option></select></label>
        <label>Budget tier<select name="budget"><option>Backpacker</option><option selected>Mid-range</option><option>Comfort</option></select></label>
        <label class="toggle"><input type="checkbox" name="womenOnly" /> Women-only trip</label>
        <button type="submit" class="btn-add">PUBLISH TRIP</button>
      </form>
    </main>
    ${renderFooter()}
  `;
}

function attachEvents() {
  const r = root();
  r.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const v = el.getAttribute('data-nav');
      if (v === 'discovery') state.view = 'discovery';
      else if (v === 'createTrip') state.view = 'createTrip';
      state.activeTripId = null;
      render();
    });
  });
  r.querySelectorAll('[data-action]').forEach((el) => {
    el.addEventListener('click', (e) => handleAction(el.getAttribute('data-action'), el, e));
  });
  const dest = r.querySelector('input[data-action="filter-dest"]');
  if (dest) dest.addEventListener('input', (e) => { state.filters.destination = e.target.value; render(); });
  const vibe = r.querySelector('select[data-action="filter-vibe"]');
  if (vibe) vibe.addEventListener('change', (e) => { state.filters.vibe = e.target.value; render(); });
  const women = r.querySelector('input[data-action="filter-women"]');
  if (women) women.addEventListener('change', (e) => { state.filters.womenOnly = e.target.checked; render(); });
  const date = r.querySelector('input[data-action="filter-date"]');
  if (date) date.addEventListener('change', (e) => { state.filters.date = e.target.value; render(); });

  r.querySelectorAll('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      r.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
      t.classList.add('active');
      const tab = t.getAttribute('data-tab');
      const it = r.querySelector('#tab-itinerary');
      const ex = r.querySelector('#tab-expenses');
      if (it && ex) { it.style.display = tab === 'itinerary' ? 'block' : 'none'; ex.style.display = tab === 'expenses' ? 'block' : 'none'; }
    });
  });

  r.querySelectorAll('input[data-action="sim-seats"]').forEach((el) => {
    el.addEventListener('input', (e) => {
      state.simSeats = Number(e.target.value);
      const lbl = r.querySelector('#sim-seats-label');
      if (lbl) lbl.textContent = state.simSeats;
      const sim = simPrice();
      const per = r.querySelector('#sim-per');
      if (per) per.textContent = formatIDR(sim.per) + '/org';
      const saving = r.querySelector('#sim-saving');
      if (saving) saving.textContent = 'HEMAT ' + Math.round((1 - 1/state.simSeats)*100) + '%';
    });
  });
  r.querySelectorAll('select[data-action="sim-vehicle"]').forEach((el) => {
    el.addEventListener('change', (e) => {
      state.simVehicle = e.target.value;
      const sim = simPrice();
      const per = r.querySelector('#sim-per');
      if (per) per.textContent = formatIDR(sim.per) + '/org';
    });
  });

  const createForm = r.querySelector('form[data-action="create-trip-submit"]');
  if (createForm) createForm.addEventListener('submit', handleCreateTrip);
  const itForm = r.querySelector('form[data-action="add-itinerary"]');
  if (itForm) itForm.addEventListener('submit', handleAddItinerary);
  const exForm = r.querySelector('form[data-action="add-expense"]');
  if (exForm) exForm.addEventListener('submit', handleAddExpense);

  animateEntrance();
}

function handleAction(action, el, e) {
  const id = el.getAttribute('data-id');
  const tripId = el.getAttribute('data-trip');
  const itId = el.getAttribute('data-it');
  const q = el.getAttribute('data-q');
  switch (action) {
    case 'toggle-theme':
      state.theme = state.theme === 'night' ? 'day' : 'night';
      applyTheme();
      render();
      break;
    case 'open-trip':
      state.activeTripId = id; state.view = 'tripRoom'; render(); break;
    case 'join-trip': {
      const trip = getTrip(id);
      if (trip && !trip.members.includes(state.currentUser.id) && trip.members.length < trip.max_pax) {
        trip.members.push(state.currentUser.id); saveState();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ['#C4F000','#FF3B8D','#00E5FF'] });
        render();
      }
      break;
    }
    case 'sim-join': {
      const trip = getTrip(id);
      if (trip && trip.members.length < trip.max_pax) {
        trip.members.push('sim-' + Date.now()); saveState();
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 }, colors: ['#C4F000'] });
        render();
      }
      break;
    }
    case 'quick-filter':
      state.filters.quick = state.filters.quick === q ? '' : q;
      render();
      break;
    case 'back-discovery':
      state.view = 'discovery'; state.activeTripId = null; render(); break;
    case 'optimize-ai':
      optimizeRoute(id); break;
    case 'trip-brief':
      generateBrief(id); break;
    case 'share-trip':
      shareTrip(id); break;
    case 'vote-it': {
      const trip = getTrip(tripId);
      const it = trip.itinerary.find((x) => x.id === itId);
      if (it) { it.votes_count += 1; saveState(); render(); }
      break;
    }
    case 'move-up': {
      const trip = getTrip(tripId);
      const idx = trip.itinerary.findIndex((x) => x.id === itId);
      if (idx > 0) {
        const a = trip.itinerary[idx].order_index;
        const b = trip.itinerary[idx-1].order_index;
        trip.itinerary[idx].order_index = b;
        trip.itinerary[idx-1].order_index = a;
        saveState(); render();
      }
      break;
    }
    case 'move-down': {
      const trip = getTrip(tripId);
      const idx = trip.itinerary.findIndex((x) => x.id === itId);
      if (idx >= 0 && idx < trip.itinerary.length - 1) {
        const a = trip.itinerary[idx].order_index;
        const b = trip.itinerary[idx+1].order_index;
        trip.itinerary[idx].order_index = b;
        trip.itinerary[idx+1].order_index = a;
        saveState(); render();
      }
      break;
    }
    case 'open-demo':
      openModal('demo-modal'); break;
    case 'close-demo':
      closeModal('demo-modal'); break;
    case 'preview-pass':
      openModal('pass-modal'); break;
    case 'close-pass':
      closeModal('pass-modal'); break;
    case 'share-pass':
      alert('Tautan emergency pass disalin (demo).'); break;
    case 'demo-optimize': {
      const ul = document.querySelector('#demo-stops');
      if (ul) {
        const items = Array.from(ul.querySelectorAll('li')).map((li) => li.textContent);
        items.sort();
        ul.innerHTML = items.map((t) => `<li>${escapeHTML(t)}</li>`).join('');
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 }, colors: ['#C4F000'] });
      }
      break;
    }
  }
}

function openModal(id) {
  const m = document.querySelector('#' + id);
  if (m) { m.classList.add('open'); m.setAttribute('aria-hidden','false'); }
}
function closeModal(id) {
  const m = document.querySelector('#' + id);
  if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }
}

function handleCreateTrip(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const trip = {
    id: 'trip-' + Date.now(),
    title: sanitizeInput(fd.get('title')),
    destination_area: sanitizeInput(fd.get('destination')),
    start_date: fd.get('startDate'),
    end_date: fd.get('startDate'),
    meeting_point: sanitizeInput(fd.get('meeting')),
    lat: parseFloat(fd.get('lat')) || -8.5,
    lng: parseFloat(fd.get('lng')) || 115.2,
    vehicle_type: sanitizeInput(fd.get('vehicle')),
    total_transport_cost: Math.max(0, Number(fd.get('cost')) || 0),
    max_pax: Math.max(1, Number(fd.get('maxpax')) || 4),
    women_only: fd.get('womenOnly') === 'on',
    status: 'OPEN',
    creator_id: state.currentUser.id,
    vibe: fd.get('vibe'),
    budget_tier: fd.get('budget'),
    members: [state.currentUser.id],
    itinerary: [],
    expenses: [],
  };
  state.trips.unshift(trip);
  saveState();
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#C4F000','#FF3B8D','#00E5FF'] });
  state.activeTripId = trip.id;
  state.view = 'tripRoom';
  render();
}

function handleAddItinerary(e) {
  e.preventDefault();
  const trip = getTrip(state.activeTripId);
  if (!trip) return;
  const fd = new FormData(e.target);
  const item = {
    id: 'it-' + Date.now(),
    day_number: 1,
    time_slot: fd.get('time'),
    place_name: sanitizeInput(fd.get('place')),
    lat: trip.lat, lng: trip.lng,
    estimated_cost: Math.max(0, Number(fd.get('cost')) || 0),
    votes_count: 0,
    order_index: trip.itinerary.length,
    proposed_by: state.currentUser.id,
  };
  trip.itinerary.push(item);
  saveState();
  render();
}

function handleAddExpense(e) {
  e.preventDefault();
  const trip = getTrip(state.activeTripId);
  if (!trip) return;
  const fd = new FormData(e.target);
  const ex = {
    id: 'ex-' + Date.now(),
    title: sanitizeInput(fd.get('title')),
    amount: Math.max(0, Number(fd.get('amount')) || 0),
    paid_by: fd.get('paidBy'),
    split_type: 'equal',
  };
  trip.expenses = trip.expenses || [];
  trip.expenses.push(ex);
  saveState();
  render();
}

function optimizeRoute(id) {
  const trip = getTrip(id);
  if (!trip || trip.itinerary.length < 2) return;
  trip.itinerary.sort((a, b) => String(a.time_slot).localeCompare(String(b.time_slot)));
  trip.itinerary.forEach((it, idx) => (it.order_index = idx));
  saveState();
  confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 }, colors: ['#00E5FF'] });
  render();
}

function generateBrief(id) {
  const trip = getTrip(id);
  if (!trip) return;
  const sc = splitCost(trip);
  const brief = [`Trip: ${trip.title}`, `Destinasi: ${trip.destination_area}`, `Tanggal: ${trip.start_date}`, `Meeting point: ${trip.meeting_point}`, `Kendaraan: ${trip.vehicle_type}`, `Peserta: ${trip.members.length}/${trip.max_pax}`, `Biaya per orang: ${formatIDR(sc.perPerson)}`, `Vibe: ${trip.vibe} | Budget: ${trip.budget_tier}`].join('\n');
  navigator.clipboard && navigator.clipboard.writeText(brief);
  alert('Trip brief disalin ke clipboard.\n\n' + brief);
}

function shareTrip(id) {
  const trip = getTrip(id);
  if (!trip) return;
  const url = `${location.origin}${location.pathname}#trip-${trip.id}`;
  navigator.clipboard && navigator.clipboard.writeText(url);
  alert('Tautan berbagi perjalanan disalin:\n' + url);
}

function initMap() {
  const container = document.querySelector('#trip-map');
  if (!container) return;
  if (state.map) { state.map.remove(); state.map = null; }
  const trip = getTrip(state.activeTripId);
  if (!trip) return;
  state.map = L.map(container).setView([trip.lat, trip.lng], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(state.map);
  L.marker([trip.lat, trip.lng]).addTo(state.map).bindPopup(trip.meeting_point);
  trip.itinerary.forEach((it) => { L.marker([it.lat, it.lng]).addTo(state.map).bindPopup(it.place_name); });
}

function animateEntrance() {
  AOS.init({ duration: 500, easing: 'ease-out-back', once: true, offset: 60 });
  gsap.from('.navbar', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' });
}

function animateSimulator() {
  const per = document.querySelector('#sim-per');
  if (per) {
    gsap.fromTo(per, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  }
}

loadState();
applyTheme();
render();
AOS.init({ duration: 500, easing: 'ease-out-back', once: true, offset: 60 });