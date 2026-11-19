/**
 * Utilitas keamanan client-side (client-side hardening).
 * - escapeHTML: lindungi rendering dari serangan XSS dengan entity escaping.
 * - sanitizeUrl: validasi URL gambar (hanya path lokal /..., https://, atau data:image/).
 * - validateProduct: validasi schema serta normalisasi nilai (harga/stok wajib valid).
 */

export function escapeHTML(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeUrl(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed === '') return null;
  if (/^https:\/\//i.test(trimmed) || /^data:image\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/') && !/^data:text\/html/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function validateProduct(product) {
  const errors = [];
  const normalized = { ...product };

  normalized.id = typeof product?.id === 'string' ? product.id.trim() : '';
  normalized.nama = typeof product?.nama === 'string' ? product.nama.trim().slice(0, 80) : '';
  normalized.kategori = typeof product?.kategori === 'string' ? product.kategori.trim().toUpperCase() : '';
  normalized.harga = Math.max(0, Math.floor(Number(product?.harga) || 0));
  normalized.stok = Math.max(0, Math.floor(Number(product?.stok) || 0));
  normalized.deskripsi = typeof product?.deskripsi === 'string' ? product.deskripsi.trim().slice(0, 300) : '';
  normalized.imageUrl = sanitizeUrl(product?.imageUrl) || null;
  normalized.unggulan = Boolean(product?.unggulan);

  if (!normalized.id) errors.push('id wajib diisi');
  if (normalized.nama.length < 3) errors.push('nama wajib 3-80 karakter');
  if (!['KOPI', 'KULINER', 'KRIYA', 'FESYEN'].includes(normalized.kategori)) {
    errors.push('kategori tidak valid');
  }
  if (Number.isNaN(normalized.harga) || normalized.harga < 0) errors.push('harga harus >= 0');
  if (!Number.isInteger(normalized.stok) || normalized.stok < 0) errors.push('stok harus integer >= 0');

  return { valid: errors.length === 0, errors, product: normalized };
}
