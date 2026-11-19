import { seedProducts } from '../data/seedProducts.js';

const KEYS = {
  products: 'lokakraft_products_v1',
  orders: 'lokakraft_orders_v1',
  cart: 'lokakraft_cart_v1',
};

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.products) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // abaikan kegagalan penyimpanan
  }
}

export function loadProducts() {
  const data = read(KEYS.products, { products: seedProducts });
  return Array.isArray(data.products) ? data.products : [...seedProducts];
}

export function saveProducts(products) {
  write(KEYS.products, { products });
}

export function loadOrders() {
  try {
    const raw = window.localStorage.getItem(KEYS.orders);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  write(KEYS.orders, orders);
}

export function loadCart() {
  try {
    const raw = window.localStorage.getItem(KEYS.cart);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  write(KEYS.cart, cart);
}
