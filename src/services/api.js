const BASE_URL = "http://127.0.0.1:8000/api";

// ── Dummy fallback data ──────────────────────────────
const DUMMY_CATEGORIES = [
  { id: 2, name: "minuman" },
  { id: 3, name: "makanan" },
  { id: 4, name: "desert" },
];

const DUMMY_MENUS = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    category_id: 3,
    price: 35000,
    description: "Nasi goreng dengan telur, ayam, dan sayuran segar pilihan chef.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    category: { id: 3, name: "makanan" },
  },
  {
    id: 2,
    name: "Mie Ayam Bakso",
    category_id: 3,
    price: 28000,
    description: "Mie ayam dengan bakso sapi kenyal dan kuah kaldu gurih.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    category: { id: 3, name: "makanan" },
  },
  {
    id: 3,
    name: "Risol Mayo",
    category_id: 3,
    price: 15000,
    description: "Risol renyah isi ragout sayur dengan saus mayo spesial.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
    category: { id: 3, name: "makanan" },
  },
  {
    id: 4,
    name: "Es Kopi Susu",
    category_id: 2,
    price: 22000,
    description: "Kopi robusta pilihan dengan susu segar dan gula aren.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    category: { id: 2, name: "minuman" },
  },
  {
    id: 5,
    name: "Matcha Latte",
    category_id: 2,
    price: 28000,
    description: "Matcha premium Jepang dengan susu oat yang creamy.",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80",
    category: { id: 2, name: "minuman" },
  },
  {
    id: 6,
    name: "Jus Jeruk Segar",
    category_id: 2,
    price: 18000,
    description: "Jeruk peras segar tanpa tambahan gula dan pengawet.",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80",
    category: { id: 2, name: "minuman" },
  },
  {
    id: 7,
    name: "Pancake Coklat",
    category_id: 4,
    price: 32000,
    description: "Pancake fluffy dengan saus coklat Belgia dan buah segar.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    category: { id: 4, name: "desert" },
  },
  {
    id: 8,
    name: "Es Krim Vanilla",
    category_id: 4,
    price: 20000,
    description: "Es krim vanilla premium dengan taburan wafer dan madu.",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80",
    category: { id: 4, name: "desert" },
  },
];

// ── API functions with fallback ──────────────────────
export async function fetchMenus() {
  try {
    const res = await fetch(`${BASE_URL}/menus`);
    const json = await res.json();
    if (!json.success) throw new Error("API error");
    return json.data;
  } catch {
    console.warn("⚠️ API tidak tersedia, menggunakan data dummy.");
    return DUMMY_MENUS;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const json = await res.json();
    if (!json.success) throw new Error("API error");
    return json.data;
  } catch {
    console.warn("⚠️ API tidak tersedia, menggunakan data dummy.");
    return DUMMY_CATEGORIES;
  }
}

// ── Create Order ─────────────────────────────────────
/**
 * POST /api/orders
 * @param {{ name: string, items: Array<{ menu_id: number, qty: number }> }} orderData
 * @returns {Promise<Object>} The order response data
 */
export async function createOrder(orderData) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal membuat pesanan");
  }

  return json.data;
}
