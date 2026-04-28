const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://web-production-c0c32.up.railway.app/api";

export const getMenus = async () => {
  const res = await fetch(`${API_BASE}/menus`);
  return res.json();
};

export const createOrder = async (payload) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};