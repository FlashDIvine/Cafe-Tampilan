import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchMenus, fetchCategories } from "./services/api";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import MenuGrid from "./components/MenuGrid";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [menusData, categoriesData] = await Promise.all([
          fetchMenus(),
          fetchCategories(),
        ]);
        setMenus(menusData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Optimistic Update Handlers ──────────────────────
  // These update local state INSTANTLY — no refetch needed

  /**
   * Optimistically add a category to the UI.
   * Called from AdminPanel BEFORE the API responds.
   */
  const handleCategoryAdded = useCallback((newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  /**
   * Replace a temporary optimistic category with the real server response.
   * Called after API returns successfully.
   */
  const handleCategoryConfirmed = useCallback((tempId, serverCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === tempId ? serverCategory : cat))
    );
  }, []);

  /**
   * Rollback an optimistic category if the API call failed.
   */
  const handleCategoryRollback = useCallback((tempId) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== tempId));
  }, []);

  /**
   * Optimistically add a menu to the UI.
   */
  const handleMenuAdded = useCallback((newMenu) => {
    setMenus((prev) => [...prev, newMenu]);
  }, []);

  /**
   * Replace a temporary optimistic menu with the real server response.
   */
  const handleMenuConfirmed = useCallback((tempId, serverMenu) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === tempId ? serverMenu : m))
    );
  }, []);

  /**
   * Rollback an optimistic menu if the API call failed.
   */
  const handleMenuRollback = useCallback((tempId) => {
    setMenus((prev) => prev.filter((m) => m.id !== tempId));
  }, []);

  // Filter menus based on search + category
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const matchesCategory =
        activeCategory === null || item.category_id === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menus, activeCategory, searchQuery]);

  // Reset animation keys when filters change
  const [filterKey, setFilterKey] = useState(0);
  useEffect(() => {
    setFilterKey((k) => k + 1);
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-cafe-950 overflow-x-hidden">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminToggle={() => setIsAdminOpen(true)}
      />

      <HeroSection totalItems={menus.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Category Filter */}
        <div className="mb-8 sm:mb-10">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-cafe-200/40">
              Menampilkan{" "}
              <span className="text-cafe-300 font-medium">
                {filteredMenus.length}
              </span>{" "}
              menu
              {activeCategory !== null && (
                <span>
                  {" "}
                  dalam{" "}
                  <span className="text-cafe-300 font-medium capitalize">
                    {categories.find((c) => c.id === activeCategory)?.name}
                  </span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  untuk &quot;<span className="text-cafe-300">{searchQuery}</span>&quot;
                </span>
              )}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div id="error-state" className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Gagal memuat menu
            </h3>
            <p className="text-cafe-200/50 max-w-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Menu Grid */}
        {!loading && !error && (
          <div key={filterKey}>
            <MenuGrid items={filteredMenus} />
          </div>
        )}
      </main>

      <Footer />

      <CartModal />

      {/* Admin Panel — optimistic update handlers passed as props */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        onCategoryAdded={handleCategoryAdded}
        onCategoryConfirmed={handleCategoryConfirmed}
        onCategoryRollback={handleCategoryRollback}
        onMenuAdded={handleMenuAdded}
        onMenuConfirmed={handleMenuConfirmed}
        onMenuRollback={handleMenuRollback}
      />
    </div>
  );
}
