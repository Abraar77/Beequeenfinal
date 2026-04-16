"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const FOUNDER_NAME = "Sania Zehra";
const FOUNDER_TITLE = "Founder & CEO, BeeQueen of Kashmir";

const SLIDES = [
  {
    image: "/founder1.jpg",
    quote:
      "BeeQueen of Kashmir was born from a deep love for our Valley — I wanted the world to taste the same pure, golden saffron and wild honey that we grew up with. Every product we offer is a piece of Kashmir's soul.",
  },
  {
    image: "/founder2.jpg",
    quote:
      "Our promise is simple: no middlemen, no compromises — just the authentic essence of Kashmir delivered straight to your home, with the same care our farmers have given it for generations.",
  },
];

const SLIDE_INTERVAL = 4000;

const variants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export default function FounderSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [next]);

  // Progress bar animation — ticks every 50ms
  useEffect(() => {
    setProgress(0);
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 100 / (SLIDE_INTERVAL / 50);
      });
    }, 50);
    return () => clearInterval(tick);
  }, [current]);

  return (
    <section className="py-20 bg-dark-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(233,30,140,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label mb-4">Meet the Founder</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            The Vision Behind{" "}
            <span className="text-shimmer">BeeQueen</span>
          </h2>
        </div>

        {/* Card */}
        <div className="max-w-5xl mx-auto">
          <div
            className="card-glass rounded-3xl overflow-hidden"
            style={{ border: "1px solid rgba(233,30,140,0.12)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image side */}
              <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={SLIDES[current].image}
                      alt={FOUNDER_NAME}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                      priority={current === 0}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-950/40 lg:block hidden" />
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                  <div
                    className="h-full transition-none"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #E91E8C, #FF2D9B)",
                    }}
                  />
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {/* Large quote icon */}
                <Quote
                  size={48}
                  className="mb-6 opacity-20"
                  style={{ color: "#E91E8C" }}
                />

                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={current}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="font-display text-lg md:text-xl text-gray-200 leading-relaxed italic mb-8">
                      &ldquo;{SLIDES[current].quote}&rdquo;
                    </p>
                  </motion.blockquote>
                </AnimatePresence>

                {/* Founder identity */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-12 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #E91E8C, #FF2D9B)" }}
                  />
                  <div>
                    <p className="text-white font-bold text-base">{FOUNDER_NAME}</p>
                    <p className="text-brand-pink text-xs tracking-wide mt-0.5">{FOUNDER_TITLE}</p>
                  </div>
                </div>

                {/* Dot navigation */}
                <div className="flex items-center gap-3">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrent(i); setProgress(0); }}
                      aria-label={`Slide ${i + 1}`}
                      className={`carousel-dot transition-all duration-300 ${i === current ? "active" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
