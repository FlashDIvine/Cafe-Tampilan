const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchMenus() {
  const res = await fetch(`${BASE_URL}/menus`);
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch menus");
  return json.data;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch categories");
  return json.data;
}
