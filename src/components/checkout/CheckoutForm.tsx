"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Phone, Mail, MapPin, User, MessageCircle, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

const schema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
  location: z.string().min(10, "Please enter your full address"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const total = totalPrice();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!items.length) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // Save order to database
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items, total_price: total }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to place order");
      }

      // Open WhatsApp with pre-filled message
      const message = buildWhatsAppMessage(
        data.customer_name,
        data.phone,
        data.email,
        data.location,
        items,
        total
      );
      window.open(getWhatsAppUrl(message), "_blank");

      clearCart();
      router.push("/order-success");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Button variant="pink" onClick={() => router.push("/shop")}>
          <span>Shop Now</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Form */}
      <div>
        <div className="mb-8">
          <p className="section-label mb-2">Step 1</p>
          <h2 className="font-display text-3xl font-bold text-white">
            Your Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            icon={<User size={15} />}
            error={errors.customer_name?.message}
            {...register("customer_name")}
          />
          <Input
            label="Phone Number"
            placeholder="10-digit mobile number"
            type="tel"
            icon={<Phone size={15} />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Email Address"
            placeholder="your@email.com"
            type="email"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MapPin size={14} className="text-gray-500" />
              Your Address
            </label>
            <textarea
              placeholder="Full address with city, state, pin code..."
              rows={4}
              className="input-luxury w-full px-4 py-3 text-sm resize-none"
              suppressHydrationWarning
              {...register("location")}
            />
            {errors.location && <p className="text-xs text-red-400">{errors.location.message}</p>}
          </div>

          <Button
            type="submit"
            variant="pink"
            size="xl"
            fullWidth
            loading={loading}
            className="gap-3 mt-2 group"
          >
            <MessageCircle size={18} />
            <span>Confirm via WhatsApp</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-xs text-gray-600">
            You&apos;ll be taken to WhatsApp to send your order directly to our team.
          </p>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <div className="mb-8">
          <p className="section-label mb-2">Step 2</p>
          <h2 className="font-display text-3xl font-bold text-white">
            Order Summary
          </h2>
        </div>

        <div className="card-luxury p-6 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <p className="text-white text-sm font-semibold line-clamp-1">{item.product.title}</p>
                <p className="text-gray-600 text-xs mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-brand-gold text-sm font-bold shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="border-t border-white/5 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Total</span>
              <span className="font-display text-2xl font-bold text-shimmer">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
