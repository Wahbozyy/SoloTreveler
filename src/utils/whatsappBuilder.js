/**
 * Builder URL WhatsApp untuk checkout keranjang.
 * - Validasi nomor tujuan format internasional (hanya digit, opsional + di depan).
 * - Pesan di-encode dengan encodeURIComponent.
 * - Nomor pemilik disimpan sebagai konfigurasi non-rahasia.
 */

export const OWNER_WHATSAPP = '625111048791'; // konfigurasi non-rahasia

export function normalizePhone(nomor) {
  if (typeof nomor !== 'string') return null;
  const trimmed = nomor.trim();
  if (trimmed === '') return null;
  // izinkan + di depan, lalu digit
  const cleaned = trimmed.replace(/\s+/g, '').replace(/-/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(cleaned)) return null;
  return cleaned.replace(/^\+/, '');
}

export function buildWhatsAppUrl(nomor, produk) {
  const phone = normalizePhone(nomor);
  if (!phone) return null;

  const items = Array.isArray(produk) ? produk : [];
  const lines = items.map((i) => `${i.nama} x${i.qty} = ${i.subtotal ?? (i.harga * i.qty)}`);
  const subtotal = items.reduce((s, i) => s + (i.harga * i.qty), 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const diskon = totalQty >= 3 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - diskon;

  const catatan = typeof produk.catatan === 'string' ? produk.catatan.trim() : '';
  const message = [
    'Pesanan LOKA-KRAFT',
    ...lines,
    '',
    `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}`,
    `Diskon 10%: -Rp ${diskon.toLocaleString('id-ID')}`,
    `Total: Rp ${total.toLocaleString('id-ID')}`,
    catatan ? `Catatan: ${catatan}` : '',
  ].filter(Boolean).join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}