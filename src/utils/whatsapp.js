// ── WhatsApp Configuration ───────────────────────────
// Change this to your actual WhatsApp number (international format, no + sign)
export const WHATSAPP_PHONE = "6285726331579";

// ── Currency Formatter ───────────────────────────────
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ── WhatsApp Message Generator ───────────────────────
/**
 * Generates a formatted WhatsApp message from order response data.
 * @param {Object} orderData - The order response from API (data field)
 * @param {string} [note] - Optional customer note
 * @returns {string} Formatted message string
 */
export function generateWhatsAppMessage(orderData, note = "") {
  const { name, total_price, items } = orderData;

  // Build item list
  const itemLines = items
    .map((item, index) => {
      const subtotal = item.menu.price * item.quantity;
      return `${index + 1}. ${item.menu.name} x${item.quantity} — ${formatCurrency(subtotal)}`;
    })
    .join("\n");

  // Assemble message
  let message = `Halo KOPER \n\n`;
  message += `Saya ingin memesan:\n\n`;
  message += `${itemLines}\n\n`;
  message += `Total: *${formatCurrency(total_price)}*\n\n`;
  message += `Nama: ${name}`;

  if (note && note.trim()) {
    message += `\nCatatan: ${note.trim()}`;
  }

  message += `\n\nTerima kasih! `;

  return message;
}

// ── WhatsApp URL Builder ─────────────────────────────
/**
 * Returns a WhatsApp deep-link URL with the encoded message.
 * @param {string} message - The message text
 * @returns {string} Full wa.me URL
 */
export function getWhatsAppURL(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
