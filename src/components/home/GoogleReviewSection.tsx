import Image from "next/image";
import { Star } from "lucide-react";

// TODO: Replace the href below with the exact URL encoded in the QR code
// (scan the QR with your phone and paste the link here)
const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Sania%27s+Bee+Farm+Kashmir";

export default function GoogleReviewSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(66,133,244,0.04) 0%, rgba(233,30,140,0.04) 100%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label mb-3">Happy Customers</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Loved on <span className="text-shimmer">Google</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
            Thousands of verified reviews. Share your experience and help others
            discover the purest honey from Kashmir.
          </p>
        </div>

        {/* Card */}
        <div
          className="flex flex-col sm:flex-row items-center gap-8 p-6 sm:p-10 rounded-3xl mx-auto max-w-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* QR Code */}
          <div className="shrink-0 bg-white p-3 rounded-2xl shadow-2xl">
            <Image
              src="/QR.jpeg"
              alt="Scan to review Sania's Bee Farm on Google"
              width={148}
              height={148}
              className="rounded-xl"
            />
            <p className="text-center text-[11px] font-bold text-gray-800 mt-2">
              Scan to Review
            </p>
          </div>

          {/* Text */}
          <div className="text-center sm:text-left">
            {/* Stars */}
            <div className="flex justify-center sm:justify-start gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-yellow-400 text-sm font-bold ml-1">4.8</span>
            </div>

            {/* Google branding */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-white font-bold text-base">Sania&apos;s Bee Farm</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Scan the QR code or tap the button below to leave a review. Your feedback helps
              us serve you better and spreads authentic Kashmiri honey to more homes.
            </p>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #4285F4 0%, #34A853 100%)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Write a Review on Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
