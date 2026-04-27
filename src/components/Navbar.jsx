import { useState, useEffect } from "react";

const ICON_SEARCH = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const ICON_COFFEE = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

export default function Navbar({ searchQuery, onSearchChange }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="relative flex-1 max-w-md mx-4 sm:mx-8">
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

          {/* Badge */}
          <div className="hidden sm:flex items-center gap-2 text-cafe-300/60 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Menu</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
