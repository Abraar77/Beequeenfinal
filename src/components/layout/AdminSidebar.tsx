"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-brand-gold/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden ring-1 ring-brand-gold/30">
            <Image src="/logo.png" alt="BeeQueen of Kashmir" fill sizes="36px" className="object-cover" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Admin Panel</p>
            <p className="text-[10px] text-brand-gold/60 tracking-widest uppercase">BeeQueen of Kashmir</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "text-dark-900 shadow-pink"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
              style={active ? { background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" } : {}}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <div className="pt-2 border-t border-white/5 mt-2">
          <Link
            href="/admin/products/new"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-brand-gold hover:bg-brand-gold/5 transition-all duration-200"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          View Store ↗
        </Link>
        <button
          onClick={handleLogout}
          suppressHydrationWarning
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full text-left"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 admin-sidebar min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        suppressHydrationWarning
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-dark-800 border border-brand-gold/20 flex items-center justify-center text-white shadow-lg"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-60 z-50 admin-sidebar flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
