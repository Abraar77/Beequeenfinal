"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const valid = images.filter(Boolean);
  if (!valid.length) {
    return (
      <div className="aspect-square rounded-2xl bg-dark-700 flex items-center justify-center">
        <span className="text-6xl">🏔️</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + valid.length) % valid.length);
  const next = () => setCurrent((c) => (c + 1) % valid.length);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-800 group cursor-zoom-in"
        onClick={() => setZoomed(true)}>
        <Image
          src={getImageUrl(valid[current])}
          alt={`${title} - ${current + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/10 transition-all duration-300" />

        {/* Zoom icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn size={14} className="text-white" />
        </div>

        {/* Nav arrows */}
        {valid.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              suppressHydrationWarning
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              suppressHydrationWarning
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Image counter */}
        {valid.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white bg-black/50 backdrop-blur-sm">
            {current + 1} / {valid.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {valid.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {valid.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === current
                  ? "border-brand-pink shadow-pink"
                  : "border-white/5 hover:border-brand-gold/40"
              }`}
            >
              <Image
                src={getImageUrl(src)}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              {i !== current && (
                <div className="absolute inset-0 bg-dark-900/40" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-4xl w-full aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageUrl(valid[current])}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
            {valid.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
