import type { CartItem } from "@/types";

const OWNER_PHONE = "919622055250";

export function buildWhatsAppMessage(
  customerName: string,
  phone: string,
  email: string,
  location: string,
  items: CartItem[],
  subtotal: number
): string {
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemLines = items
    .map(
      (item) =>
        `  • ${item.product.title}\n    Qty: ${item.quantity} × ₹${item.product.price.toLocaleString("en-IN")} = ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}`
    )
    .join("\n");

  const message = `Hey! I'm interested in placing an order from BeeQueen of Kashmir 🛍️

I'd like to order the following:
${itemLines}

💰 Total: ₹${subtotal.toLocaleString("en-IN")}

Please send it to my address below:
📍 ${location}

My details:
👤 Name: ${customerName}
📞 Phone: ${phone}
📧 Email: ${email}

Could you please confirm the order and let me know the delivery timeline? Thank you! 🙏
🕐 ${now}`;

  return message;
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(message)}`;
}
