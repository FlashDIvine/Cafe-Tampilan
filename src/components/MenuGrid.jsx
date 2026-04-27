import MenuCard from "./MenuCard";

export default function MenuGrid({ items }) {
  if (items.length === 0) {
    return (
      <div id="menu-empty" className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Menu tidak ditemukan</h3>
        <p className="text-cafe-200/50 max-w-sm">
          Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
        </p>
      </div>
    );
  }

  return (
    <div
      id="menu-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {items.map((item, index) => (
        <MenuCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
