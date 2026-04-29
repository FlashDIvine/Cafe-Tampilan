import { useState, useEffect, useRef } from "react";
import { createCategory, createMenu } from "../services/api";

// ── Icons ────────────────────────────────────────────
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

// ── Toast notification ───────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in flex items-center gap-2 ${
        type === "success"
          ? "bg-emerald-500/90 text-white"
          : "bg-red-500/90 text-white"
      }`}
    >
      {type === "success" ? <IconCheck /> : <span>⚠️</span>}
      {message}
    </div>
  );
}

// ── Temp ID generator (negative to avoid collision with server IDs) ──
let tempIdCounter = -1;
function getTempId() {
  return tempIdCounter--;
}

// ── Admin Panel Component ────────────────────────────
export default function AdminPanel({
  isOpen,
  onClose,
  categories,
  onCategoryAdded,
  onCategoryConfirmed,
  onCategoryRollback,
  onMenuAdded,
  onMenuConfirmed,
  onMenuRollback,
}) {
  const [activeTab, setActiveTab] = useState("category");
  const [isClosing, setIsClosing] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Category form state ─────────────────────────────
  const [catName, setCatName] = useState("");
  const [catSubmitting, setCatSubmitting] = useState(false);

  // ── Menu form state ─────────────────────────────────
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuCategoryId, setMenuCategoryId] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuImage, setMenuImage] = useState("");
  const [menuSubmitting, setMenuSubmitting] = useState(false);

  const panelRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // ── OPTIMISTIC: Add Category ──────────────────────────
  const handleAddCategory = async () => {
    const name = catName.trim();
    if (!name || catSubmitting) return;

    const tempId = getTempId();
    const optimisticCategory = {
      id: tempId,
      name,
      is_active: true,
      _optimistic: true,
    };

    // 1. INSTANT UI update — user sees it immediately
    onCategoryAdded(optimisticCategory);
    setCatName("");
    setToast({ message: `Kategori "${name}" ditambahkan!`, type: "success" });

    // 2. Send to API in background
    setCatSubmitting(true);
    try {
      const serverCategory = await createCategory({ name });
      // 3. Replace temp item with real server data
      onCategoryConfirmed(tempId, serverCategory);
    } catch (err) {
      // 4. ROLLBACK on failure
      onCategoryRollback(tempId);
      setToast({ message: err.message || "Gagal menambah kategori", type: "error" });
    } finally {
      setCatSubmitting(false);
    }
  };

  // ── OPTIMISTIC: Add Menu ──────────────────────────────
  const handleAddMenu = async () => {
    const name = menuName.trim();
    const price = parseInt(menuPrice, 10);
    if (!name || isNaN(price) || price < 0 || menuSubmitting) return;

    const tempId = getTempId();
    const catId = menuCategoryId ? parseInt(menuCategoryId, 10) : null;
    const matchedCategory = categories.find((c) => c.id === catId) || null;

    const optimisticMenu = {
      id: tempId,
      name,
      price,
      category_id: catId,
      description: menuDescription.trim() || null,
      image: menuImage.trim() || null,
      category: matchedCategory,
      _optimistic: true,
    };

    // 1. INSTANT UI update
    onMenuAdded(optimisticMenu);
    setMenuName("");
    setMenuPrice("");
    setMenuCategoryId("");
    setMenuDescription("");
    setMenuImage("");
    setToast({ message: `Menu "${name}" ditambahkan!`, type: "success" });

    // 2. Send to API in background
    setMenuSubmitting(true);
    try {
      const serverMenu = await createMenu({
        name: optimisticMenu.name,
        price: optimisticMenu.price,
        category_id: optimisticMenu.category_id,
        description: optimisticMenu.description,
        image: optimisticMenu.image,
      });
      // 3. Replace temp with real server data
      onMenuConfirmed(tempId, serverMenu);
    } catch (err) {
      // 4. ROLLBACK on failure
      onMenuRollback(tempId);
      setToast({ message: err.message || "Gagal menambah menu", type: "error" });
    } finally {
      setMenuSubmitting(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <div
        id="admin-overlay"
        className={`fixed inset-0 z-[100] flex justify-end ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 overlay-backdrop" />

        {/* Panel */}
        <div
          ref={panelRef}
          id="admin-panel"
          className={`relative w-full max-w-md h-full bg-cafe-950/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl shadow-black/40 flex flex-col ${
            isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-sm">⚙️</span>
              </div>
              <h2 className="text-lg font-display font-semibold text-white">
                Admin Panel
              </h2>
            </div>
            <button
              id="admin-close-btn"
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-cafe-200/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
            >
              <IconClose />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            <button
              id="tab-category"
              onClick={() => setActiveTab("category")}
              className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "category"
                  ? "text-cafe-300 border-b-2 border-cafe-300 bg-white/[0.03]"
                  : "text-cafe-200/50 hover:text-white"
              }`}
            >
              + Kategori
            </button>
            <button
              id="tab-menu"
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "menu"
                  ? "text-cafe-300 border-b-2 border-cafe-300 bg-white/[0.03]"
                  : "text-cafe-200/50 hover:text-white"
              }`}
            >
              + Menu
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 cart-scrollbar">
            {/* ── Category Tab ────────────────────── */}
            {activeTab === "category" && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider mb-4">
                    Tambah Kategori Baru
                  </h3>
                  <p className="text-xs text-cafe-200/30 mb-4">
                    Kategori akan muncul langsung di filter bar setelah ditambahkan.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cat-name" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                    Nama Kategori <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="cat-name"
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="contoh: Minuman, Snack..."
                    className="input-field"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    autoFocus
                  />
                </div>

                {/* Existing categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-cafe-200/30 uppercase tracking-wider">
                    Kategori Saat Ini
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat.id}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border capitalize ${
                          cat._optimistic
                            ? "bg-cafe-400/10 border-cafe-400/30 text-cafe-300 animate-pulse"
                            : "bg-white/[0.04] border-white/[0.08] text-cafe-200/70"
                        }`}
                      >
                        {cat.name}
                        {cat._optimistic && (
                          <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-cafe-300 animate-pulse" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Menu Tab ────────────────────────── */}
            {activeTab === "menu" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider mb-4">
                    Tambah Menu Baru
                  </h3>
                  <p className="text-xs text-cafe-200/30 mb-4">
                    Menu akan muncul langsung di halaman setelah ditambahkan.
                  </p>
                </div>

                {/* Menu Name */}
                <div className="space-y-2">
                  <label htmlFor="menu-name" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                    Nama Menu <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="menu-name"
                    type="text"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    placeholder="contoh: Es Teh Manis"
                    className="input-field"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label htmlFor="menu-price" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                    Harga (Rp) <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="menu-price"
                    type="number"
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    placeholder="15000"
                    min="0"
                    className="input-field"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="menu-category" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    id="menu-category"
                    value={menuCategoryId}
                    onChange={(e) => setMenuCategoryId(e.target.value)}
                    className="input-field appearance-none"
                  >
                    <option value="">Pilih kategori...</option>
                    {categories
                      .filter((c) => c.id > 0) // exclude optimistic items not yet confirmed
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="menu-desc" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                    Deskripsi <span className="text-cafe-200/20">(opsional)</span>
                  </label>
                  <textarea
                    id="menu-desc"
                    value={menuDescription}
                    onChange={(e) => setMenuDescription(e.target.value)}
                    placeholder="Deskripsi singkat menu..."
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label htmlFor="menu-image" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                    URL Gambar <span className="text-cafe-200/20">(opsional)</span>
                  </label>
                  <input
                    id="menu-image"
                    type="url"
                    value={menuImage}
                    onChange={(e) => setMenuImage(e.target.value)}
                    placeholder="https://..."
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer — Submit Button */}
          <div className="border-t border-white/[0.06] px-6 py-5">
            {activeTab === "category" ? (
              <button
                id="submit-category-btn"
                onClick={handleAddCategory}
                disabled={!catName.trim() || catSubmitting}
                className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {catSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <IconPlus /> Tambah Kategori
                  </>
                )}
              </button>
            ) : (
              <button
                id="submit-menu-btn"
                onClick={handleAddMenu}
                disabled={!menuName.trim() || !menuPrice || menuSubmitting}
                className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {menuSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <IconPlus /> Tambah Menu
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}
