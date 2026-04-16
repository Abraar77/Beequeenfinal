import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, getImageUrl } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Order, OrderStatus, CartItem } from "@/types";
import { ArrowLeft, Phone, Mail, MapPin, User } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_BADGE: Record<OrderStatus, "gold" | "pink" | "green" | "red" | "gray"> = {
  pending: "gold",
  processing: "pink",
  shipped: "pink",
  delivered: "green",
  cancelled: "red",
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const order = data as Order;
  const items = order.items as CartItem[];

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Back */}
      <Link href="/admin/orders" className="flex items-center gap-2 text-gray-500 hover:text-brand-gold text-sm transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-600 text-sm">{formatDate(order.created_at)}</p>
        </div>
        <Badge variant={STATUS_BADGE[order.status]}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-5">
        {/* Customer Info */}
        <div className="card-luxury p-6">
          <h2 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Customer Details</h2>
          <div className="space-y-3">
            {[
              { icon: User, label: "Name", value: order.customer_name },
              { icon: Phone, label: "Phone", value: order.phone },
              { icon: Mail, label: "Email", value: order.email },
              { icon: MapPin, label: "Address", value: order.location },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="text-brand-gold/60 mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-600 text-xs">{label}: </span>
                  <span className="text-white text-sm">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="card-luxury p-6">
          <h2 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Order Items</h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-dark-700 shrink-0">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.title}
                      fill className="object-cover" sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🏔️</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.product?.title}</p>
                  <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                </div>
                <span className="text-brand-gold font-bold text-sm">
                  {formatPrice((item.product?.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <span className="text-white font-bold">Total</span>
            <span className="font-display text-2xl font-bold text-shimmer">
              {formatPrice(order.total_price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
