"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";

const CARDS = [
  {
    image: "/award.jpeg",
    badge: "Best Quality Brand",
    badgeIcon: Trophy,
    badgeColor: "#D4AF37",
    title: "Brandithon Award 2026",
    subtitle: "11th SKUAST-K AgriTech Mela · Feb 16, 2026",
    description:
      "Sania's Bee Farm was honoured with the prestigious Best Quality Brand award at the 11th SKUAST-K AgriTech Mela, organised by Sher-e-Kashmir University of Agricultural Sciences & Technology. A ₹15,000 cash prize was awarded in recognition of our uncompromising commitment to purity.",
    tag: "GONGUL · Brandithon",
  },
  {
    image: "/owais-yaqoob.jpeg",
    badge: "Celebrity Endorsement",
    badgeIcon: Star,
    badgeColor: "#E91E8C",
    title: "Trusted by Champions",
    subtitle: "Owais Yaqoob · International MMA Fighter, Kashmir",
    description:
      "Renowned international MMA athlete Owais Yaqoob — one of Kashmir's proudest champions — personally chose Sania's Bee Farm honey for his training. When a fighter who demands only the best trusts your product, it speaks louder than any award.",
    tag: "BRAVE CF Fighter · Kashmir",
  },
  {
    image: "/stall-agri.jpeg",
    badge: "Brand Biz Exhibition",
    badgeIcon: Users,
    badgeColor: "#D4AF37",
    title: "Our Stall at AgriTech Mela",
    subtitle: "GONGUL Brand Biz · SKUAST Shalimar Campus",
    description:
      "Our exhibition stall at the GONGUL Brand Biz showcase drew hundreds of visitors eager to experience pure Kashmiri honey and natural products first-hand. It was here, surrounded by the Valley's best entrepreneurs, that Sania's Bee Farm took home the coveted Best Quality Brand title.",
    tag: "11th SKUAST-K AgriTech Mela",
  },
];

const INTERVAL = 5000;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function AchievementsSection() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [progress, setProgress] = useState(0);

  const go = useCallback((next: number) => {
    setDir(next > current ? 1 : -1);
    setCurrent(next);
    setProgress(0);
  }, [current]);

  const goNext = useCallback(() => {
    go((current + 1) % CARDS.length);
  }, [current, go]);

  const goPrev = useCallback(() => {
    go((current - 1 + CARDS.length) % CARDS.length);
  }, [current, go]);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(goNext, INTERVAL);
    return () => clearInterval(id);
  }, [goNext]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / (INTERVAL / 50)));
    }, 50);
    return () => clearInterval(id);
  }, [current]);

  const card = CARDS[current];
  const BadgeIcon = card.badgeIcon;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(233,30,140,0.03) 100%)" }}
      />
      <div className="absolute inset-0 border-y border-white/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-4">Recognition & Milestones</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            The World Notices{" "}
            <span className="text-shimmer">Excellence</span>
          </h2>
          <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
            Awards won, champions who trust us, and the moments that define who we are.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image side */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={current}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                      priority={current === 0}
                    />
                    {/* Dark overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

                    {/* Badge pill on image */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm"
                        style={{
                          background: `rgba(0,0,0,0.55)`,
                          border: `1px solid ${card.badgeColor}40`,
                          color: card.badgeColor,
                        }}
                      >
                        <BadgeIcon size={11} />
                        {card.badge}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                  <div
                    className="h-full transition-none"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${card.badgeColor}, ${card.badgeColor}cc)`,
                    }}
                  />
                </div>

                {/* Arrow navigation on image (mobile) */}
                <button
                  onClick={goPrev}
                  className="lg:hidden absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={goNext}
                  className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Content side */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={current}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-col gap-5 flex-1"
                  >
                    {/* Title & subtitle */}
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs font-semibold tracking-wide" style={{ color: card.badgeColor }}>
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                      {card.description}
                    </p>

                    {/* Tag */}
                    <span
                      className="self-start px-3 py-1 rounded-lg text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
                    >
                      {card.tag}
                    </span>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  {/* Dots */}
                  <div className="flex items-center gap-2">
                    {CARDS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => go(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: i === current ? "20px" : "8px",
                          height: "8px",
                          background: i === current ? card.badgeColor : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Arrow buttons (desktop) */}
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={goPrev}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white border transition-all"
                      style={{ background: card.badgeColor, borderColor: card.badgeColor }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Counter */}
                  <span className="text-gray-600 text-xs font-mono">
                    {String(current + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
