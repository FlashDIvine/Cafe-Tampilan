import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import {
  formatCurrency,
  generateWhatsAppMessage,
  getWhatsAppURL,
} from "../utils/whatsapp";

// ── Icons ────────────────────────────────────────────
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconMinus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconWhatsApp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-cafe-300/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ── Cart Item Row ────────────────────────────────────
function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="cart-item group">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-cafe-900/50 flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cafe-900 to-cafe-950">
            <span className="text-2xl opacity-40">🍽️</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate capitalize">{item.name}</h4>
        <p className="text-xs text-cafe-300 mt-0.5">{formatCurrency(item.price)}</p>

        <div className="flex items-center gap-2 mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-0 rounded-lg border border-white/[0.08] overflow-hidden">
            <button
              id={`qty-minus-${item.id}`}
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-cafe-200/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
            >
              <IconMinus />
            </button>
            <span className="w-8 h-7 flex items-center justify-center text-sm font-medium text-white bg-white/[0.03]">
              {item.quantity}
            </span>
            <button
              id={`qty-plus-${item.id}`}
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-cafe-200/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
            >
              <IconPlus />
            </button>
          </div>

          {/* Remove */}
          <button
            id={`remove-item-${item.id}`}
            onClick={() => onRemove(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-bold text-gradient">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}

// ── Main Cart Modal ──────────────────────────────────
export default function CartModal() {
  const {
    cartItems,
    isCartOpen,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    closeCart,
  } = useCart();

  const [isCheckout, setIsCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const panelRef = useRef(null);

  // Reset checkout state when cart opens/closes
  useEffect(() => {
    if (isCartOpen) {
      setIsCheckout(false);
      setCustomerName("");
      setCustomerNote("");
      setSubmitError(null);
      setOrderSuccess(false);
      setIsClosing(false);
    }
  }, [isCartOpen]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeCart();
      setIsClosing(false);
    }, 300);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isCartOpen) handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isCartOpen]);

  // ── Checkout Handler ───────────────────────────────
  const handleCheckout = async () => {
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare order payload
      const orderPayload = {
        name: customerName.trim(),
        items: cartItems.map((item) => ({
          menu_id: item.id,
          qty: item.quantity,
        })),
      };

      // Send to API
      const orderData = await createOrder(orderPayload);

      // Generate WhatsApp message from response
      const message = generateWhatsAppMessage(orderData, customerNote);
      const whatsappURL = getWhatsAppURL(message);

      // Show success briefly, then redirect
      setOrderSuccess(true);

      setTimeout(() => {
        window.open(whatsappURL, "_blank");
        clearCart();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Checkout failed:", err);
      setSubmitError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen && !isClosing) return null;

  return (
    <div
      id="cart-overlay"
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
        id="cart-panel"
        className={`relative w-full max-w-md h-full bg-cafe-950/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl shadow-black/40 flex flex-col ${
          isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
      >
        {/* ── Header ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {isCheckout && !orderSuccess && (
              <button
                id="checkout-back-btn"
                onClick={() => setIsCheckout(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-cafe-200/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200 -ml-1"
              >
                <IconBack />
              </button>
            )}
            <h2 className="text-lg font-display font-semibold text-white">
              {orderSuccess
                ? "Pesanan Berhasil!"
                : isCheckout
                ? "Checkout"
                : "Keranjang Anda"}
            </h2>
            {!isCheckout && !orderSuccess && cartCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cafe-400/20 text-cafe-300 text-xs font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <button
            id="cart-close-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-cafe-200/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            <IconClose />
          </button>
        </div>

        {/* ── Success State ───────────────────────── */}
        {orderSuccess && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-6 animate-bounce-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/25 flex items-center justify-center">
                <IconCheck />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pesanan Terkirim!</h3>
            <p className="text-sm text-cafe-200/50 text-center max-w-xs">
              Mengalihkan ke WhatsApp...
            </p>
          </div>
        )}

        {/* ── Empty State ─────────────────────────── */}
        {!orderSuccess && !isCheckout && cartItems.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in">
            <IconCart />
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Keranjang Kosong</h3>
            <p className="text-sm text-cafe-200/40 text-center max-w-xs">
              Tambahkan menu favorit Anda untuk mulai memesan.
            </p>
            <button
              onClick={handleClose}
              className="btn-ghost mt-6 text-sm"
            >
              Jelajahi Menu
            </button>
          </div>
        )}

        {/* ── Cart Items List ─────────────────────── */}
        {!orderSuccess && !isCheckout && cartItems.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 cart-scrollbar">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cafe-200/50">Total</span>
                <span className="text-xl font-bold text-gradient">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              <button
                id="checkout-btn"
                onClick={() => setIsCheckout(true)}
                className="btn-primary w-full py-3 text-sm font-semibold"
              >
                Checkout ({cartCount} item)
              </button>
            </div>
          </>
        )}

        {/* ── Checkout Form ───────────────────────── */}
        {!orderSuccess && isCheckout && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Order Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                  Ringkasan Pesanan
                </h3>
                <div className="glass rounded-xl p-4 space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-cafe-200/70 capitalize">
                        {item.name} <span className="text-cafe-300">x{item.quantity}</span>
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Total</span>
                    <span className="text-sm font-bold text-gradient">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <label htmlFor="customer-name" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                  Nama Anda <span className="text-red-400">*</span>
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="input-field"
                  autoFocus
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label htmlFor="customer-note" className="text-xs font-semibold text-cafe-200/40 uppercase tracking-wider">
                  Catatan <span className="text-cafe-200/20">(opsional)</span>
                </label>
                <textarea
                  id="customer-note"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Contoh: Tanpa gula, extra pedas..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Error */}
              {submitError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                  <span className="text-red-400 text-sm mt-0.5">⚠️</span>
                  <p className="text-sm text-red-300">{submitError}</p>
                </div>
              )}
            </div>

            {/* Checkout Footer */}
            <div className="border-t border-white/[0.06] px-6 py-5">
              <button
                id="order-whatsapp-btn"
                onClick={handleCheckout}
                disabled={!customerName.trim() || isSubmitting}
                className="btn-whatsapp w-full py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <IconWhatsApp />
                    Order via WhatsApp
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
