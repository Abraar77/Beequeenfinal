import { Shield, Leaf, Zap, Award, Users, Package } from "lucide-react";

const BADGES = [
  {
    icon: Shield,
    title: "100% Authentic",
    desc: "Directly sourced from Kashmir with quality certification",
    color: "text-brand-gold",
    bg: "rgba(212,175,55,0.08)",
    border: "rgba(212,175,55,0.15)",
  },
  {
    icon: Leaf,
    title: "Farm to Table",
    desc: "Natural, pure products without additives or preservatives",
    color: "text-emerald-400",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.15)",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Nationwide shipping with real-time order tracking",
    color: "text-brand-pink",
    bg: "rgba(233,30,140,0.08)",
    border: "rgba(233,30,140,0.15)",
  },
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Every batch lab-tested for purity and freshness",
    color: "text-blue-400",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.15)",
  },
  {
    icon: Users,
    title: "10,000+ Happy Customers",
    desc: "Trusted across India with 4.9★ average rating",
    color: "text-purple-400",
    bg: "rgba(196,181,253,0.08)",
    border: "rgba(196,181,253,0.15)",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    desc: "Vacuum-sealed, tamper-proof packaging for maximum freshness",
    color: "text-orange-400",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.15)",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-20 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Why Choose Us</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Your Life Starts <span className="text-shimmer">Here</span>
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            We don&apos;t just sell products — we deliver authenticity, trust, and the essence of Kashmir.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BADGES.map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div
              key={title}
              className="group flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: bg,
                border: `1px solid ${border}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon size={20} className={color} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
