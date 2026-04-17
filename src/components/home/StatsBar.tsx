"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 10000, suffix: "+", label: "Happy Customers", color: "text-brand-gold" },
  { value: 10, suffix: "+", label: "Premium Products", color: "text-brand-pink" },
  { value: 2, suffix: "+", label: "Years of Trust", color: "text-brand-gold" },
  { value: 4.9, suffix: "★", label: "Average Rating", color: "text-brand-pink" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isDecimal = !Number.isInteger(value);
          const duration = 1800;
          const steps = 60;
          const stepValue = value / steps;
          let step = 0;

          const interval = setInterval(() => {
            step++;
            const next = Math.min(stepValue * step, value);
            setCurrent(isDecimal ? Math.round(next * 10) / 10 : Math.floor(next));
            if (step >= steps) clearInterval(interval);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {Number.isInteger(value) ? current.toLocaleString("en-IN") : current.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(233,30,140,0.05) 100%)"
      }} />
      <div className="absolute inset-0 border-y border-brand-gold/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-brand-gold/10">
          {STATS.map(({ value, suffix, label, color }) => (
            <div key={label} className="flex flex-col items-center text-center py-4 px-6">
              <span className={`font-display text-4xl md:text-5xl font-bold ${color} mb-2`}>
                <AnimatedNumber value={value} suffix={suffix} />
              </span>
              <span className="text-gray-500 text-sm font-medium tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
