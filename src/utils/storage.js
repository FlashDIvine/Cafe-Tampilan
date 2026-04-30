const CART_KEY = "cart";

export const safeGetCart = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(CART_KEY);
      if (stored) return JSON.parse(stored);
    }
  } catch (error) {
    console.warn(
      "Diagnostic: localStorage is blocked or unavailable (e.g. iframe, restricted origin). Attempting sessionStorage fallback.",
      error
    );
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const sessionStored = window.sessionStorage.getItem(CART_KEY);
        if (sessionStored) return JSON.parse(sessionStored);
      }
    } catch (sessionError) {
      console.warn(
        "Diagnostic: sessionStorage is also blocked or unavailable. Falling back to in-memory state only.",
        sessionError
      );
    }
  }
  return [];
};

export const safeSetCart = (cart) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  } catch (error) {
    console.warn(
      "Diagnostic: localStorage is blocked or unavailable (e.g. iframe, restricted origin). Attempting sessionStorage fallback.",
      error
    );
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
      }
    } catch (sessionError) {
      console.warn(
        "Diagnostic: sessionStorage is also blocked or unavailable. Falling back to in-memory state only.",
        sessionError
      );
    }
  }
};
