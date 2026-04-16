"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ChevronDown } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders: initial }: OrderTableProps) {
  const [orders, setOrders] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (!orders.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-2">No orders yet</p>
        <p className="text-gray-600 text-sm">Orders will appear here once customers start purchasing.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Order</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">Total</th>
            <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-white/2 transition-colors group">
              {/* Order ID */}
              <td className="px-4 py-3">
                <span className="text-gray-400 font-mono text-xs">
                  #{o.id.slice(0, 8).toUpperCase()}
                </span>
              </td>

              {/* Customer */}
              <td className="px-4 py-3">
                <div>
                  <p className="text-white font-medium">{o.customer_name}</p>
                  <p className="text-gray-600 text-xs">{o.phone}</p>
                </div>
              </td>

              {/* Total */}
              <td className="px-4 py-3 text-right">
                <span className="text-brand-gold font-bold">{formatPrice(o.total_price)}</span>
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                <div className="relative inline-flex items-center">
                  <select
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    suppressHydrationWarning
                    className="appearance-none bg-transparent text-xs font-bold uppercase tracking-wider cursor-pointer pr-5 focus:outline-none disabled:opacity-50"
                    style={{
                      color:
                        o.status === "delivered"
                          ? "#34d399"
                          : o.status === "cancelled"
                          ? "#f87171"
                          : o.status === "pending"
                          ? "#d4af37"
                          : "#e91e8c",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={{ background: "#1A1A1A", color: "#fff" }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-0 pointer-events-none text-gray-600" />
                </div>
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(o.created_at)}</td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-brand-gold hover:bg-brand-gold/10 transition-all ml-auto"
                >
                  <Eye size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
