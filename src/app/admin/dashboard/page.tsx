import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus } from "lucide-react";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServiceClient();

  const [productsRes, ordersRes] = await Promise.all([
    supabase.from("products").select("id, title, stock, featured, price"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
  ]);

  const products = productsRes.data || [];
  const orders = (ordersRes.data || []) as Order[];

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total_price, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending");

  const STATS = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-brand-gold",
      bg: "rgba(212,175,55,0.1)",
      border: "rgba(212,175,55,0.2)",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-brand-pink",
      bg: "rgba(233,30,140,0.1)",
      border: "rgba(233,30,140,0.2)",
      href: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "rgba(251,146,60,0.1)",
      border: "rgba(251,146,60,0.2)",
      href: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.2)",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Welcome back, Admin 👋</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-dark-900 transition-all hover:shadow-pink"
          style={{ background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }}>
          <Plus size={15} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, bg, border, href }) => (
          <Link key={label} href={href}
            className="block p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            style={{ background: bg, border: `1px solid ${border}` }}>
            <div className={`${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-white font-bold text-2xl mb-1">{value}</p>
            <p className="text-gray-500 text-xs font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/products"
          className="flex items-center gap-4 p-5 card-luxury rounded-2xl hover:-translate-y-0.5 transition-transform">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <Package size={18} className="text-brand-gold" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Manage Products</p>
            <p className="text-gray-600 text-xs mt-0.5">View, edit or delete products</p>
          </div>
        </Link>
        <Link href="/admin/orders"
          className="flex items-center gap-4 p-5 card-luxury rounded-2xl hover:-translate-y-0.5 transition-transform">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.2)" }}>
            <ShoppingBag size={18} className="text-brand-pink" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">View Orders</p>
            <p className="text-gray-600 text-xs mt-0.5">Track and update order statuses</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
