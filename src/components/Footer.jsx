export default function Footer() {
  return (
    <footer id="footer" className="mt-20 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cafe-300 to-cafe-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold font-display">C</span>
            </div>
            <span className="text-sm text-cafe-200/40">
              © {new Date().getFullYear()} CaféMenu. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-cafe-200/30">
            <span className="hover:text-cafe-300 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-cafe-300 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-cafe-300 transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
