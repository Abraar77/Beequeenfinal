"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Search, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  {
    label: "Categories",
    href: "/shop",
    children: [
      { label: "🍯 Honey", href: "/shop?category=honey" },
      { label: "🧴 Honey Soap", href: "/shop?category=honey-soap" },
      { label: "Saffron", href: "/shop?category=saffron" },
      { label: "Dry Fruits", href: "/shop?category=dry-fruits" },
      { label: "Shilajit", href: "/shop?category=shilajit" },
    ],
  },
  { label: "About", href: "/#about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { totalItems, openCart } = useCartStore();
  const count = totalItems();

  useEffect(() => setMounted(true), []);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "fixed top-10 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-dark-900/95 backdrop-blur-xl border-b border-brand-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden ring-1 ring-brand-gold/20 group-hover:ring-brand-gold/50 transition-all duration-300">
              <Image
                src="/logo.png"
                alt="BeeQueen of Kashmir"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-sm md:text-base font-bold text-shimmer leading-tight">
                BeeQueen of Kashmir
              </p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                Premium Kashmiri Products
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" ref={dropRef}>
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.children ? (
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === link.label ? null : link.label)
                    }
                    suppressHydrationWarning
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      "hover:text-brand-gold hover:bg-white/5",
                      dropdownOpen === link.label ? "text-brand-gold" : "text-gray-300"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200",
                        dropdownOpen === link.label && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      "hover:text-brand-gold hover:bg-white/5",
                      pathname === link.href ? "text-brand-gold" : "text-gray-300"
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.children && dropdownOpen === link.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 card-glass border border-brand-gold/20 rounded-2xl overflow-hidden shadow-luxury z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors duration-150"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              suppressHydrationWarning
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-brand-gold hover:bg-white/5 transition-all duration-200"
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              suppressHydrationWarning
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-pulse-glow"
                  style={{ background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              suppressHydrationWarning
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="hidden md:block pb-4 animate-fade-up">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
                if (q) window.location.href = `/shop?search=${encodeURIComponent(q)}`;
              }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                name="q"
                placeholder="Search for honey, saffron, dry fruits..."
                className="input-luxury w-full pl-11 pr-4 py-3 text-sm"
                suppressHydrationWarning
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-dark-800/98 backdrop-blur-xl border-t border-brand-gold/10 overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    suppressHydrationWarning
                    onClick={() => setDropdownOpen(dropdownOpen === link.label ? null : link.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      "hover:text-brand-gold hover:bg-white/5",
                      dropdownOpen === link.label ? "text-brand-gold bg-white/5" : "text-gray-300"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform duration-200", dropdownOpen === link.label && "rotate-180")}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      dropdownOpen === link.label ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="pl-4 pb-1 grid grid-cols-2 gap-1 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-gray-400 hover:text-brand-gold hover:bg-white/5 transition-colors font-medium"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    "hover:text-brand-gold hover:bg-white/5",
                    pathname === link.href ? "text-brand-gold bg-white/5" : "text-gray-300"
                  )}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          {/* Mobile search */}
          <form
            className="pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
              if (q) window.location.href = `/shop?search=${encodeURIComponent(q)}`;
            }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                name="q"
                placeholder="Search products..."
                className="input-luxury w-full pl-10 pr-4 py-2.5 text-sm"
                suppressHydrationWarning
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
