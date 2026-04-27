export default function MenuCard({ item, index }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(item.price);

  return (
    <div
      id={`menu-card-${item.id}`}
      className="group glass glass-hover rounded-2xl overflow-hidden animate-slide-up animate-stagger"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cafe-900/50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cafe-900 to-cafe-950">
            <span className="text-5xl opacity-40">🍽️</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge */}
        {item.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-black/40 backdrop-blur-md text-cafe-100 border border-white/[0.08] capitalize">
              {item.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white capitalize leading-snug group-hover:text-cafe-200 transition-colors duration-300">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-1.5 text-sm text-cafe-200/50 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <span className="text-lg font-bold text-gradient">
            {formattedPrice}
          </span>
          <div className="w-8 h-8 rounded-lg bg-cafe-400/10 flex items-center justify-center group-hover:bg-cafe-400/20 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cafe-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
