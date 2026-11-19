import { escapeHTML } from './security.js';

export function formatRupiah(amount) {
  const value = Math.max(0, Number(amount) || 0);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return escapeHTML(formatted);
}
