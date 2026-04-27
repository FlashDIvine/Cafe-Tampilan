const CATEGORY_ICONS = {
  makanan: "🍽️",
  minuman: "🥤",
  desert: "🍰",
  default: "✨",
};

function getIcon(name) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (lower.includes(key)) return CATEGORY_ICONS[key];
  }
  return CATEGORY_ICONS.default;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <section id="category-filter" className="w-full">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* All Button */}
        <button
          id="category-all"
          onClick={() => onCategoryChange(null)}
          className={`group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
            ${
              activeCategory === null
                ? "bg-gradient-to-r from-cafe-300 to-cafe-400 text-cafe-950 shadow-lg shadow-cafe-300/25"
                : "bg-white/[0.04] border border-white/[0.08] text-cafe-200 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]"
            }`}
        >
          <span className="text-base">🔥</span>
          <span>Semua</span>
          {activeCategory === null && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          )}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`category-${cat.id}`}
            onClick={() => onCategoryChange(cat.id)}
            className={`group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
              ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-cafe-300 to-cafe-400 text-cafe-950 shadow-lg shadow-cafe-300/25"
                  : "bg-white/[0.04] border border-white/[0.08] text-cafe-200 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]"
              }`}
          >
            <span className="text-base">{getIcon(cat.name)}</span>
            <span className="capitalize">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
