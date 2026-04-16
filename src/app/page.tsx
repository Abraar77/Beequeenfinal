import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustBadges from "@/components/home/TrustBadges";
import StatsBar from "@/components/home/StatsBar";
import CategoryStrip from "@/components/home/CategoryStrip";
import FounderSection from "@/components/home/FounderSection";
import GoogleReviewSection from "@/components/home/GoogleReviewSection";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR — revalidate every hour

export const metadata: Metadata = {
  title: "BeeQueen of Kashmir — Premium Kashmiri Products",
  description:
    "Discover authentic Kashmiri honey, pure saffron, premium dry fruits & more. Farm to your table, direct from Kashmir.",
};

async function FeaturedSection() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return <FeaturedProducts products={featured || []} />;
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />

      {/* Categories section */}
      <section className="py-16 bg-dark-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="section-label mb-3">Browse by Category</p>
              <h2 className="font-display text-4xl font-bold text-white">
                What Are You <span className="text-shimmer">Looking For?</span>
              </h2>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-brand-gold hover:text-brand-gold-light text-sm font-semibold transition-colors group whitespace-nowrap">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Suspense fallback={<div className="h-12" />}>
            <CategoryStrip />
          </Suspense>
        </div>
      </section>

      {/* Featured Products */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" className="text-brand-gold" />
          </div>
        }
      >
        <FeaturedSection />
      </Suspense>

      <TrustBadges />

      <FounderSection />

      <GoogleReviewSection />

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(233,30,140,0.08) 100%)"
        }} />
        <div className="absolute inset-0 border-y border-brand-gold/10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="section-label mb-4">Limited Time Offer</p>
  
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Stock up on premium Kashmiri products and enjoy free pan-India delivery. Authentic. Pure. Guaranteed.
          </p>
          <Link href="/shop">
            <button suppressHydrationWarning className="btn-pink px-10 py-4 text-base font-semibold inline-flex items-center gap-3 group">
              <span className="relative z-10 inline-flex items-center gap-3">
                Shop Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-4">Our Story</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                The Heart of
                <span className="text-shimmer block">Kashmir, Delivered</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                BeeQueen of Kashmir was born from a simple belief: everyone deserves access to the pure, unadulterated taste of Kashmir. From the saffron fields of Pampore to the walnut orchards of Shopian — we source directly from local farmers who have been cultivating these treasures for generations.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                No middlemen. No additives. No compromises. Just the authentic flavors of the Valley, delivered to your doorstep with love.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop">
                  <button suppressHydrationWarning className="btn-pink px-8 py-3 text-sm font-semibold">
                    <span className="relative z-10">Explore Products</span>
                  </button>
                </Link>
                <a href="https://www.instagram.com/beequeenofkashmir/" target="_blank" rel="noopener noreferrer">
                  <button suppressHydrationWarning className="btn-outline px-8 py-3 text-sm font-semibold">
                    Follow on Instagram
                  </button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "8+", text: "Years of Experience", color: "text-brand-gold" },
                { number: "10K+", text: "Happy Customers", color: "text-brand-pink" },
                { number: "50+", text: "Premium Products", color: "text-brand-gold" },
                { number: "4.9★", text: "Average Rating", color: "text-brand-pink" },
              ].map(({ number, text, color }) => (
                <div key={text} className="card-luxury p-6 text-center">
                  <div className={`font-display text-4xl font-bold ${color} mb-2`}>{number}</div>
                  <div className="text-gray-500 text-sm">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
