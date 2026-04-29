import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const ICON_SEARCH = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

export default function Navbar({ searchQuery, onSearchChange }) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bounce animation when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cafe-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" id="logo" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cafe-300 to-cafe-500 flex items-center justify-center shadow-lg shadow-cafe-300/20 group-hover:shadow-cafe-300/40 transition-shadow duration-300">
              <span className="text-white text-lg font-bold font-display">C</span>
            </div>
            <span className="text-xl font-display font-semibold text-white tracking-tight hidden sm:block">
              Café<span className="text-cafe-300">Menu</span>
            </span>
          </a>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md ml-4 mr-14 sm:mx-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cafe-300">
              {ICON_SEARCH}
            </div>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari menu favorit..."
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] 
                         text-white placeholder-cafe-300/40 text-sm
                         focus:outline-none focus:ring-2 focus:ring-cafe-300/40 focus:border-cafe-300/40 focus:bg-white/[0.08]
                         transition-all duration-300"
            />
          </div>

          {/* Cart Button */}
          <button
            id="cart-toggle-btn"
            onClick={toggleCart}
            className="fixed top-3 right-3 z-[1000] sm:relative sm:top-auto sm:right-auto sm:z-auto w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.06] sm:bg-white/[0.06] backdrop-blur-md sm:backdrop-blur-none border border-white/[0.08] flex items-center justify-center text-cafe-200/60 hover:text-white hover:bg-white/[0.10] hover:border-white/[0.15] transition-all duration-300 active:scale-[0.95]"
            aria-label="Open cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            {/* Badge */}
            {cartCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-cafe-300 to-cafe-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-cafe-400/30 ${
                  bounce ? "animate-bounce-in" : ""
                }`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
