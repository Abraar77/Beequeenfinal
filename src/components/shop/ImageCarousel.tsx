"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  title: string;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  showDots?: boolean;
}

export default function ImageCarousel({
  images,
  title,
  autoPlay = true,
  interval = 3000,
  className = "",
  aspectRatio = "square",
  showDots = true,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const valid = images.filter(Boolean);
  const count = valid.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % count);
  }, [count]);

  useEffect(() => {
    if (!autoPlay || count <= 1 || isHovered) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, count, interval, isHovered, next]);

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  };

  if (!count) {
    return (
      <div className={`${aspectClasses[aspectRatio]} bg-dark-700 rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-gray-600 text-4xl">🏔️</span>
      </div>
    );
  }

  return (
    <div
      className={`relative img-zoom-container ${aspectClasses[aspectRatio]} rounded-xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      {valid.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={getImageUrl(src)}
            alt={`${title} ${i + 1}`}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent z-10 pointer-events-none" />

      {/* Dots */}
      {showDots && count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
          {valid.map((_, i) => (
            <button
              key={i}
              suppressHydrationWarning
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrent(i);
              }}
              className={`carousel-dot transition-all duration-300 ${i === current ? "active" : ""}`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrow navigation for multiple images */}
      {count > 1 && isHovered && (
        <>
          <button
            suppressHydrationWarning
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCurrent((c) => (c - 1 + count) % count); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            suppressHydrationWarning
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
