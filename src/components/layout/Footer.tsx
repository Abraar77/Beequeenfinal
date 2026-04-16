"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "Honey", href: "/shop?category=honey" },
  { label: "Honey Soap", href: "/shop?category=honey-soap" },
  { label: "Saffron", href: "/shop?category=saffron" },
  { label: "Dry Fruits", href: "/shop?category=dry-fruits" },
  { label: "Shilajit", href: "/shop?category=shilajit" },
  { label: "Kahwa & Tea", href: "/shop?category=kahwa-tea" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/#about" },
];

function FooterInner() {
  return (
    <footer className="bg-dark-950 border-t border-brand-gold/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-brand-gold/30">
                <Image src="/logo.png" alt="BeeQueen of Kashmir" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="font-display text-base font-bold text-shimmer">BeeQueen of Kashmir</p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-gray-600">Premium Products</p>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Bringing the finest, most authentic Kashmiri products straight from the valley to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/beequeenofkashmir/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-brand-pink/30 flex items-center justify-center text-brand-pink hover:bg-brand-pink/10 transition-all duration-200"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://wa.me/919622055250"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold/10 transition-all duration-200"
              >
                <Phone size={15} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-brand-gold rounded" />
              Categories
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="text-gray-500 hover:text-brand-gold text-sm transition-colors duration-150 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-brand-gold transition-colors" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-brand-gold rounded" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-brand-gold text-sm transition-colors duration-150 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-brand-gold transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-brand-gold rounded" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919622055250" className="flex items-start gap-3 text-sm text-gray-500 hover:text-brand-gold transition-colors group">
                  <Phone size={14} className="mt-0.5 text-brand-gold/60 group-hover:text-brand-gold shrink-0" />
                  +91 9622055250
                </a>
              </li>
              <li>
                <a href="mailto:beequeenofkashmir@gmail.com" className="flex items-start gap-3 text-sm text-gray-500 hover:text-brand-gold transition-colors group">
                  <Mail size={14} className="mt-0.5 text-brand-gold/60 group-hover:text-brand-gold shrink-0" />
                  beequeenofkashmir@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin size={14} className="mt-0.5 text-brand-gold/60 shrink-0" />
                Kashmir, Jammu & Kashmir, India
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
              <p className="text-xs text-gray-500 mb-2">Order via WhatsApp</p>
              <a
                href="https://wa.me/919622055250"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-gold text-sm font-semibold hover:text-brand-gold-light transition-colors"
              >
                <ExternalLink size={13} />
                Chat with Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} BeeQueen of Kashmir. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <FooterInner />;
}
