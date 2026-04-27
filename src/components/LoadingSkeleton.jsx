export default function LoadingSkeleton() {
  return (
    <div id="loading-skeleton" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-white/[0.04]" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="h-5 bg-white/[0.06] rounded-lg w-3/4" />
            <div className="h-4 bg-white/[0.04] rounded-lg w-full" />
            <div className="h-4 bg-white/[0.04] rounded-lg w-1/2" />
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="h-6 bg-white/[0.06] rounded-lg w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
