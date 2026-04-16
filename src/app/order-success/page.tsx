"use client";

import Link from "next/link";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-16 flex items-center justify-center">
      <div className="max-w-lg w-full px-4 text-center">
        {/* Success animation */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div
            className="absolute w-32 h-32 rounded-full animate-pulse"
            style={{ background: "rgba(52,211,153,0.15)" }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.1))",
              border: "2px solid rgba(52,211,153,0.4)",
            }}
          >
            <CheckCircle size={44} className="text-emerald-400" />
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Order <span className="text-emerald-400">Confirmed!</span>
        </h1>
        <p className="text-gray-400 text-lg mb-3 leading-relaxed">
          Thank you for your order! Your WhatsApp message has been sent to our team.
        </p>
        <p className="text-gray-600 text-sm mb-10">
          We&apos;ll confirm your order and reach out on WhatsApp shortly.
          For questions, call{" "}
          <a href="tel:+919622055250" className="text-brand-gold hover:underline">
            +91 9622055250
          </a>
        </p>

        {/* WhatsApp reminder */}
        <div className="mb-8 p-5 rounded-2xl text-left"
          style={{ background: "rgba(37,211,102,0.07)", border: "1px solid rgba(37,211,102,0.2)" }}>
          <div className="flex items-start gap-3">
            <MessageCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm mb-1">Check your WhatsApp</p>
              <p className="text-gray-500 text-xs">
                A message with your order details has been sent to our team. If it didn&apos;t open automatically,{" "}
                <a
                  href="https://wa.me/919622055250"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  click here
                </a>{" "}
                to send it manually.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="pink" size="lg" className="gap-2 group">
              <span>Continue Shopping</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="https://wa.me/919622055250" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="gap-2">
              <MessageCircle size={16} />
              Contact Us
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
