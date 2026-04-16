/**
 * Server-side WhatsApp notification via CallMeBot (free).
 *
 * One-time setup for the owner:
 * 1. Save +34 644 55 25 26 as "CallMeBot" in your WhatsApp contacts
 * 2. Send exactly this message to that number via WhatsApp:
 *    I allow callmebot to send me messages
 * 3. You'll receive a reply with your API key
 * 4. Add to .env.local:
 *    CALLMEBOT_API_KEY=your_key_here
 *    OWNER_WHATSAPP_PHONE=919622055250
 */

const API_KEY = process.env.CALLMEBOT_API_KEY;
const OWNER_PHONE = process.env.OWNER_WHATSAPP_PHONE || "919622055250";

export async function sendOwnerWhatsApp(text: string): Promise<void> {
  if (!API_KEY) {
    console.warn("[notify] CALLMEBOT_API_KEY not set — WhatsApp notification skipped.");
    return;
  }

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${OWNER_PHONE}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${API_KEY}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text();
      console.error("[notify] CallMeBot error:", res.status, body);
    }
  } catch (err) {
    console.error("[notify] Failed to send WhatsApp notification:", err);
  }
}
