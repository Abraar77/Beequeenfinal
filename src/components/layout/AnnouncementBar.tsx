"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const MESSAGES = [
  "🍯 Pure Raw Kashmiri Honey — Straight from the Hive to Your Home",
  "🌿 100% Authentic Kashmiri Products — Straight from the Valley",
  "⭐ Premium Quality Guaranteed — Trusted by 10,000+ Customers",
  "📞 Customer Support: +91 9622055250",
];

const BG = "linear-gradient(90deg, #E91E8C 0%, #b01070 50%, #E91E8C 100%)";

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (pathname?.startsWith("/admin")) return null;

  // Server + pre-mount: render a static single message so there's no text mismatch
  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 h-10 overflow-hidden z-50 flex items-center px-4"
        style={{ background: BG }}>
        <span className="text-white text-xs font-semibold tracking-wide">
          {MESSAGES[0]}
        </span>
      </div>
    );
  }

  const doubled = [...MESSAGES, ...MESSAGES];

  return (
    <div className="fixed top-0 left-0 right-0 h-10 overflow-hidden z-50 flex items-center"
      style={{ background: BG }}>
      <div className="flex gap-12 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
        {doubled.map((msg, i) => (
          <span key={i} className="text-white text-xs font-semibold tracking-wide shrink-0">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
