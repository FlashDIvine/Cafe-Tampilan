export default function HeroSection({ totalItems }) {
  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-10 sm:pb-14 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cafe-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-cafe-300/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Tagline Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cafe-400/10 border border-cafe-400/20 mb-6 animate-fade-in">
            <span className="text-sm">☕</span>
            <span className="text-xs font-medium text-cafe-300 tracking-wide uppercase">
              Menu Kami
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight animate-slide-up">
            Temukan{" "}
            <span className="text-gradient">Cita Rasa</span>
            <br />
            Favorit Anda
          </h1>

          <p className="mt-5 text-lg text-cafe-200/50 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
            Jelajahi koleksi menu spesial kami — dari makanan lezat, minuman segar, hingga dessert manis yang menggoda.
          </p>

          {/* Stats */}
          {totalItems > 0 && (
            <div className="mt-8 flex items-center gap-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <span className="text-cafe-300 font-bold text-lg">{totalItems}</span>
                </div>
                <span className="text-sm text-cafe-200/40">Menu tersedia</span>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="w-2 h-2 rounded-full bg-cafe-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <span className="text-sm text-cafe-200/40">Selalu fresh</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
