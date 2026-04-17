import Link from "next/link";
import Image from "next/image";
import { Star, Shield, Truck } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Logo as full background photo */}
        <Image
          src="/background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.70) 50%, rgba(10,10,10,0.88) 100%)"
        }} />
        {/* Subtle grid on top */}
        <div className="absolute inset-0 hero-grid opacity-100" />

        {/* Gold radial glow top-center */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)" }}
        />
        {/* Saffron glow bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(233,30,140,0.5) 0%, transparent 70%)" }}
        />
      </div>

      {/* Mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 pointer-events-none">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 200 L180 80 L300 140 L480 20 L660 120 L720 60 L780 120 L960 30 L1080 110 L1260 50 L1440 130 L1440 200 Z" fill="rgba(212,175,55,0.1)" />
          <path d="M0 200 L200 120 L350 160 L500 90 L680 150 L760 100 L840 150 L1000 80 L1140 140 L1300 100 L1440 160 L1440 200 Z" fill="rgba(212,175,55,0.05)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 text-center">
        {/* Label badge */}
        

        {/* Heading */}
        <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-5 sm:mb-6">
          <span className="block text-white">Taste the</span>
          <span className="block text-shimmer">Magic of</span>
          <span className="block text-white">Kashmir</span>
        </h1>

        {/* Subheading */}
       

        {/* CTAs */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <Link href="/shop" className="w-full xs:w-auto">
            <Button size="xl" variant="pink" className="w-full xs:w-auto px-8 sm:px-10">
              Explore Products
            </Button>
          </Link>
          <a href="https://wa.me/919622055250" target="_blank" rel="noopener noreferrer" className="w-full xs:w-auto">
            <Button size="xl" variant="outline" className="w-full xs:w-auto px-8 sm:px-10">
              Free Counselling
            </Button>
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-col xs:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-10 px-4">
          {[
            { icon: Star, text: "4.8/5 Rating", sub: "2,000+ reviews" },
            { icon: Shield, text: "100% Authentic", sub: "Direct from Kashmir" },
            { icon: Truck, text: "Pan India", sub: "Shipping Available" },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <Icon size={16} className="text-brand-gold" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold leading-tight">{text}</p>
                <p className="text-gray-600 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-5 h-8 rounded-full border border-brand-gold/40 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-brand-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
}
