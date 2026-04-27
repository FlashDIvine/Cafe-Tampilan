const API_BASE = "http://127.0.0.1:8000/api";

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