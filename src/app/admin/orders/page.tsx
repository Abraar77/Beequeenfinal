import { createServiceClient } from "@/lib/supabase/server";
import OrderTable from "@/components/admin/OrderTable";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data || []) as Order[];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-600 text-sm mt-1">{orders.length} orders total</p>
      </div>
      <OrderTable orders={orders} />
    </div>
  );
}
